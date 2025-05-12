package vn.hust.omni.sale.service.store.interfaces;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.store.application.model.location.LocationCreateRequest;
import vn.hust.omni.sale.service.store.application.model.location.LocationResponse;
import vn.hust.omni.sale.service.store.application.model.location.LocationUpdateRequest;
import vn.hust.omni.sale.service.store.application.service.LocationService;
import vn.hust.omni.sale.shared.security.StoreId;

@RestController
@RequestMapping(value = "/admin/location")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;


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

//    @DeleteMapping("{id}")
//    public void delete(@PathVariable("id") int id, @StoreId int storeId) {
//        locationService.delete(storeId, id);
//    }
}
