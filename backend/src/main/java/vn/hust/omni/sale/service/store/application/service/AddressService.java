package vn.hust.omni.sale.service.store.application.service;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.lib.address.*;
import vn.hust.omni.sale.shared.common_util.TextUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AddressService {

    // region [country]

    public List<Country> findCountries(String query) {
        if (query == null)
            return findCountries();
        var search = query.trim();
        return AddressUtils.countryList()
                .parallelStream().filter(country ->
                        TextUtils.stripAccents(country.getName())
                                .contains(Objects.requireNonNull(TextUtils.stripAccents(search))))
                .toList();
    }

    public List<Country> findCountries() {
        return AddressUtils.countryList();
    }

    public Country findCountryByCode(String code) {
        if (code == null)
            return null;
        return AddressUtils.countryByCode(code.trim());
    }

    public Country findCountryById(int id) {
        return AddressUtils.countryById(id);
    }
    // endregion

    // region [province]
    public List<Province> findProvinces(String query) {
        if (query == null)
            return findProvinces();
        return findProvincesByName(query);
    }

    public List<Province> findProvinces() {
        return AddressUtils.provinceList();
    }

    public Province findProvinceByCode(String code) {
        if (code == null)
            return null;
        return AddressUtils.provinceByCode(code.trim());
    }

    public Province findProvinceByName(String name) {
        if (name == null)
            return null;
        return AddressUtils.provinceByName(name.trim());
    }

    public List<Province> findProvincesByName(String name) {
        if (name == null)
            return null;
        return AddressUtils.provinceList()
                .parallelStream()
                .filter(province ->
                        TextUtils.stripAccents(province.getName())
                                .contains(Objects.requireNonNull(TextUtils.stripAccents(name.trim())))
                ).toList();
    }
    //endregion

    //region [district]

    public List<District> findDistricts(String query, String provinceCode) {
        List<District> districts;
        if (query != null) {
            var search = query.trim();
            var provinces = findProvincesByName(search);
            districts = provinces.stream().map(province ->
                    findDistrictsByProvinceCode(province.getCode())
            ).reduce((a, b) -> Stream.concat(a.stream(), b.stream()).toList()).orElse(new ArrayList<>());
            var searchDistricts = findDistricts().stream().filter(district ->
                    TextUtils.stripAccents(district.getName()).contains(
                            Objects.requireNonNull(TextUtils.stripAccents(search)))
            ).toList();
            districts = Stream.concat(districts.stream(), searchDistricts.stream()).toList();
        } else {
            districts = findDistricts();
        }
        if (provinceCode != null) {
            var province = AddressUtils.provinceByCode(provinceCode.trim());
            if (province == null)
                return List.of();
            return districts.stream().filter(district -> district.getProvinceId() == province.getId()).toList();
        }
        return districts;
    }

    public List<District> findDistricts() {
        return AddressUtils.districtList();
    }

    public List<District> findDistrictsByProvinceCode(String provinceCode) {
        var province = AddressUtils.provinceByCode(provinceCode.trim());
        if (province == null)
            return List.of();
        return AddressUtils.districtsByProvince(province);
    }

    public District findDistrictByCode(String code) {
        if (code == null)
            return null;
        return AddressUtils.districtByCode(code.trim());
    }

    public District findDistrictByProvinceCodeAndCode(String provinceCode, String code) {
        if (code == null || provinceCode == null)
            return null;
        var province = AddressUtils.provinceByCode(provinceCode.trim());
        if (province != null)
            return AddressUtils.districtByCode(province, code.trim());
        return null;
    }
    // endregion

    //region [ward]

    public List<Ward> findWards(String query, String provinceCode, String districtCode) {
        if (provinceCode == null && districtCode == null && query == null)
            return findWards();
        List<Ward> wards;
        if (provinceCode == null)
            wards = findWardsByDistrictCode(districtCode);
        else if (districtCode == null)
            wards = findWardsByProvinceCode(provinceCode);
        else
            wards = findWardsByProvinceCodeAndDistrictCode(provinceCode, districtCode);
        if (query != null) {
            var search = query.trim();
            wards = wards.parallelStream().filter(ward -> TextUtils.stripAccents(ward.getName())
                    .contains(Objects.requireNonNull(TextUtils.stripAccents(search)))).toList();
        }
        return wards;
    }

    public List<Ward> findWards() {
        return AddressUtils.wardList();
    }

    public List<Ward> findWardsByDistrictCode(String districtCode) {
        if (districtCode == null)
            return List.of();
        var district = AddressUtils.districtByCode(districtCode.trim());
        if (district == null)
            return null;
        return AddressUtils.wardsByDistrict(district);
    }

    public List<Ward> findWardsByProvinceCode(String provinceCode) {
        if (provinceCode == null)
            return List.of();
        var province = AddressUtils.provinceByCode(provinceCode.trim());
        if (province == null)
            return List.of();
        return AddressUtils.wardsByProvince(province);
    }

    public List<Ward> findWardsByProvinceCodeAndDistrictCode(@NotNull String provinceCode, @NotNull String districtCode) {
        if (provinceCode == null || districtCode == null)
            return List.of();
        var province = AddressUtils.provinceByCode(provinceCode.trim());
        if (province == null)
            return List.of();
        var district = AddressUtils.districtByCode(province, districtCode);
        if (district == null)
            return List.of();
        return AddressUtils.wardsByDistrict(district);
    }

    public Ward findWardByCode(String code) {
        if (code == null)
            return null;
        return AddressUtils.wardByCode(code.trim());
    }

    public Ward findWardByDistrictCodeAndCode(String districtCode, String code) {
        if (districtCode == null || code == null)
            return null;
        var district = AddressUtils.districtByCode(districtCode.trim());
        if (district != null)
            return AddressUtils.wardByCode(district, code.trim());
        return null;
    }
    //endregion

}
