package vn.hust.omni.sale.service.store.interfaces;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.lib.address.Country;
import vn.hust.omni.sale.lib.address.District;
import vn.hust.omni.sale.lib.address.Province;
import vn.hust.omni.sale.lib.address.Ward;
import vn.hust.omni.sale.service.store.application.model.location.*;
import vn.hust.omni.sale.service.store.application.service.AddressService;
import vn.hust.omni.sale.service.store.application.service.LocationService;
import vn.hust.omni.sale.shared.security.StoreId;

import java.util.List;

@RestController
@RequestMapping(value = "/admin/location")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;
    private final AddressService addressService;

    @Validated
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocationResponse create(@StoreId int storeId, @RequestBody @Valid LocationCreateRequest request) {
        return locationService.create(storeId, request);
    }

    @Validated
    @PutMapping("{id}")
    public LocationResponse update(@PathVariable("id") int id, @StoreId int storeId, @RequestBody @Valid LocationUpdateRequest request) {
        return locationService.update(id, storeId, request);
    }

    @GetMapping
    public LocationsResponse get(@StoreId int storeId, FilterLocationsRequest request) {
        return locationService.get(storeId, request);
    }

    @GetMapping("{id}")
    public LocationResponse get(@PathVariable("id") int id, @StoreId int storeId) {
        return locationService.getById(storeId, id);
    }

    @GetMapping("/countries")
    public List<Country> findCountries(@RequestParam(value = "query", required = false) String query) {
        return addressService.findCountries(query);
    }

    @GetMapping("/provinces")
    public List<Province> findProvinces(@RequestParam(value = "query", required = false) String query) {
        return addressService.findProvinces(query);
    }

    @GetMapping("/districts")
    public List<District> findDistricts(@RequestParam(value = "query", required = false) String query,
                                        @RequestParam(required = false) String provinceCode) {
        return addressService.findDistricts(query, provinceCode);
    }

    @GetMapping("/wards")
    public List<Ward> findWards(@RequestParam(value = "query", required = false) String query,
                                @RequestParam(required = false) String provinceCode,
                                @RequestParam(required = false) String districtCode) {
        return addressService.findWards(query, provinceCode, districtCode);
    }

//    @DeleteMapping("{id}")
//    public void delete(@PathVariable("id") int id, @StoreId int storeId) {
//        locationService.delete(storeId, id);
//    }
}
