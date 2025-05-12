package vn.hust.omni.sale.service.store.application.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.hust.omni.sale.lib.address.*;
import vn.hust.omni.sale.service.store.application.constant.Role;
import vn.hust.omni.sale.service.store.application.model.location.LocationCreateRequest;
import vn.hust.omni.sale.service.store.application.model.location.LocationResponse;
import vn.hust.omni.sale.service.store.application.model.location.LocationUpdateRequest;
import vn.hust.omni.sale.service.store.application.service.mapper.LocationMapper;
import vn.hust.omni.sale.service.store.domain.model.Location;
import vn.hust.omni.sale.service.store.domain.repository.JpaLocationRepository;
import vn.hust.omni.sale.service.store.infrastructure.utils.PhoneUtils;
import vn.hust.omni.sale.shared.ApiClient;
import vn.hust.omni.sale.shared.common_util.TextUtils;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.NotFoundException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.time.Instant;
import java.util.Objects;

import static vn.hust.omni.sale.service.store.application.constant.Location.LIMIT_LOCATION;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final JpaLocationRepository locationRepository;
    private final AddressService addressService;

    private final LocationMapper locationMapper;
    private final ApiClient apiClient;

    @Transactional
    public LocationResponse create(int storeId, LocationCreateRequest request) {
        verifyPermissionInternalBasicAuth();
        var total = locationRepository.countByStoreIdAndDeletedIsFalse(storeId);
        if (total >= LIMIT_LOCATION)
            throw new ConstraintViolationException("limit_location", "Maximum allowed limit of 500 locations.");
        var location = Location.builder()
                .storeId(storeId)
                .defaultLocation(false)
                .deleted(false)
                .status(Location.Status.active)
                .build();
        locationMapper.mapDtoToEntity(request, location);
        verifyCode(location);
        verifyName(location);
        verifyPhone(location);
        verifyAddress(location);
        verifyDefaultLocation(location);
        verifyInventoryManagement(location, location.isInventoryManagement(), false);

        var resultLocation = locationRepository.save(location);

        return locationMapper.toResponse(resultLocation);
    }

    @Transactional
    public LocationResponse update(int id, int storeId, LocationUpdateRequest request) {
        var location = locationRepository.findByIdAndStoreId(id, storeId).orElseThrow(NotFoundException::new);
        var changeInventoryManagement = request.getInventoryManagement() != null && !Objects.equals(request.getInventoryManagement(), location.isInventoryManagement());
        var changeStatus = request.getStatus() != null && !request.getStatus().equals(location.getStatus());
        if (!changeInventoryManagement) {
            request.setInventoryManagement(null);
        }

        verifyPermissionInternalBasicAuth();
        if (BooleanUtils.isFalse(request.getDefaultLocation()) && BooleanUtils.isTrue(location.isDefaultLocation()))
            throw new ConstraintViolationException("default_location", " location is default can't change manual");
        if (request.getCode() != null && request.getCode().isPresent()) {
            verifyCode(new Location(location.getId(), location.getStoreId(), request.getCode().get()));
        }
        locationMapper.mapDtoToEntity(request, location);
        verifyName(location);
        verifyPhone(location);
        verifyAddress(location);
        verifyInventoryManagement(location, changeInventoryManagement, changeStatus);
        if (BooleanUtils.isFalse(request.getInventoryManagement()) && location.isDefaultLocation())
            throw new ConstraintViolationException("inventory_management", " default location require inventory_management's location is true");
        if (BooleanUtils.isFalse(request.getFulfillOrder()) && location.isDefaultLocation())
            throw new ConstraintViolationException("fulfill_order", " default location require fulfill_order's location is true");
        verifyDefaultLocation(location);

        var resultLocation = locationRepository.save(location);

        return locationMapper.toResponse(resultLocation);
    }

    private void verifyPermissionInternalBasicAuth() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var permissions = authentication.getAuthorities();
        var hasPermissionFull = permissions.stream().anyMatch(new SimpleGrantedAuthority("ROLE_full")::equals);
        if (hasPermissionFull) return;

        if (permissions.stream().noneMatch(new SimpleGrantedAuthority("ROLE_" + Role.location_settings.name())::equals)) {
            throw new ConstraintViolationException(UserError.builder()
                    .code("access_denied")
                    .message("Access denied. Required access: the same access level needed to mutate the owner resource.")
                    .build()
            );
        }
    }

    private void verifyPhone(Location location) {
        if (location.getPhone() != null) {
            if (StringUtils.isBlank(location.getPhone())) {
                throw new ConstraintViolationException("phone", "must not be blank");
            }
            location.setPhone(PhoneUtils.standardZero(location.getPhone()));
        }
    }

    private void verifyCode(Location location) {
        if (location.getCode() != null) {
            location.setCode(location.getCode().trim());
            if (StringUtils.isBlank(location.getCode())) {
                throw new ConstraintViolationException("code", "must not be blank");
            }
            if (!TextUtils.withoutSpecialCharacter(location.getCode())) {
                throw new ConstraintViolationException("code", "Allow special character [a-zA-Z0-9_]");
            }
            locationRepository.findTop2ByStoreIdAndCodeAndDeletedIsFalse(location.getStoreId(), location.getCode()).forEach(item -> {
                if (item.getId() != location.getId())
                    throw new ConstraintViolationException("code", location.getCode() + " is existed");
            });
        }
    }

    private void verifyName(Location location) {
        if (location.getName() != null) {
            location.setName(location.getName());
            locationRepository.findTop2ByStoreIdAndNameAndDeletedIsFalse(location.getStoreId(), location.getName()).forEach(item -> {
                if (item.getId() != location.getId())
                    throw new ConstraintViolationException("name", location.getName() + " is existed");
            });
        }
    }

    private void verifyAddress(Location location) {
        var country = verifyCountry(location);
        location.setCountryCode(country != null ? country.getCode() : null);
        location.setCountry(country != null ? country.getName() : null);
        if (country == null || !StringUtils.equals(location.getCountryCode(), AddressUtils.VN_COUNTRY_CODE)) {
            location.setProvinceCode(null);
        }
        var province = verifyProvince(location);
        location.setProvinceCode(province != null ? province.getCode() : null);
        location.setProvince(province != null ? province.getName() : null);
        if (province == null)
            location.setDistrictCode(null);
        var district = verifyDistrict(location);
        location.setDistrictCode(district != null ? district.getCode() : null);
        location.setDistrict(district != null ? district.getName() : null);
        if (district == null)
            location.setWardCode(null);
        var ward = verifyWard(location);
        location.setWardCode(ward != null ? ward.getCode() : null);
        location.setWard(ward != null ? ward.getName() : null);
    }

    private Country verifyCountry(Location location) {
        if (location.getCountryCode() != null) {
            var country = addressService.findCountryByCode(location.getCountryCode());
            if (country == null)
                throw new ConstraintViolationException("country_code", " not found country by country_code-" + location.getCountryCode());
            return country;
        }
        return null;
    }

    private Province verifyProvince(Location location) {
        if (location.getProvinceCode() != null) {
            var province = addressService.findProvinceByCode(location.getProvinceCode());
            if (province == null || !StringUtils.equals(location.getCountryCode(), AddressUtils.VN_COUNTRY_CODE))
                throw new ConstraintViolationException("province_code", " not found province by province_code-" + location.getProvinceCode());
            return province;
        }
        return null;
    }

    private District verifyDistrict(Location location) {
        if (location.getDistrictCode() != null) {
            var district = addressService.findDistrictByProvinceCodeAndCode(location.getProvinceCode(), location.getDistrictCode());
            if (district == null)
                throw new ConstraintViolationException("district_code", " not found district by district_code-" + location.getDistrictCode());
            return district;
        }
        return null;
    }

    private Ward verifyWard(Location location) {
        if (location.getWardCode() != null) {
            var ward = addressService.findWardByDistrictCodeAndCode(location.getDistrictCode(), location.getWardCode());
            if (ward == null)
                throw new ConstraintViolationException("ward_code", "not found ward by ward_code-" + location.getWardCode());
            return ward;
        }
        return null;
    }

    private void verifyDefaultLocation(Location location) {
        if (location.isDefaultLocation()) {
            if (!location.isInventoryManagement() || Location.Status.expired.equals(location.getStatus()))
                throw new ConstraintViolationException("default_location", " require inventory_management,fulfill_order's location are true and status is active");
            locationRepository.findByStoreIdAndDefaultLocationIsTrueAndDeletedIsFalse(location.getStoreId()).forEach(item -> {
                if (item.getId() != location.getId())
                    locationRepository.updateDefaultLocationByIdAndStoreId(item.getId(), item.getStoreId(),
                            false);
            });
        }
    }

    private void verifyInventoryManagement(Location location, boolean changeInventoryManagement, boolean changeStatus) {
        if (!location.isInventoryManagement() && changeInventoryManagement)
            throw new ConstraintViolationException("inventory_management", "Can not update location is not inventory management");
        if (!location.isInventoryManagement() && Location.Status.expired.equals(location.getStatus()))
            throw new ConstraintViolationException("status", "Not Inventory management location status can not be expired");
        if (!location.isInventoryManagement() || Location.Status.expired.equals(location.getStatus()) ||
            !changeInventoryManagement && !changeStatus)
            return;
    }
}
