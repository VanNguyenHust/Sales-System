package vn.hust.omni.sale.service.store.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.store.application.model.store.administrator.FilterStoresRequest;
import vn.hust.omni.sale.service.store.application.model.store.administrator.OpenLimitStoreRequest;
import vn.hust.omni.sale.service.store.application.model.store.administrator.StoreResponse;
import vn.hust.omni.sale.service.store.application.model.store.administrator.StoresResponse;
import vn.hust.omni.sale.service.store.application.model.store_features.StoreFeaturesResponse;
import vn.hust.omni.sale.service.store.application.service.StoreFeatureService;
import vn.hust.omni.sale.service.store.application.service.StoreService;

@RestController
@RequestMapping(value = "/administrator")
@RequiredArgsConstructor
public class AdministratorController {
    private final StoreService storeService;
    private final StoreFeatureService storeFeatureService;

    @PutMapping("/store_feature/{storeId}/enable/{featureKey}")
    public void enableStoreFeature(@PathVariable int storeId, @PathVariable String featureKey) {
        storeFeatureService.enable(storeId, featureKey);
    }

    @PutMapping("/store_feature/{storeId}/disable/{featureKey}")
    public void disableStoreFeature(@PathVariable int storeId, @PathVariable String featureKey) {
        storeFeatureService.disable(storeId, featureKey);
    }

    @PutMapping("/store/{storeId}/open_limit")
    public void openLimitStore(@PathVariable int storeId, @RequestBody OpenLimitStoreRequest request) {
        storeService.openLimitStore(storeId, request);
    }

    @GetMapping("/store/{storeId}/features")
    public StoreFeaturesResponse getStoreFeatures(@PathVariable int storeId) {
        return storeFeatureService.get(storeId);
    }

    @DeleteMapping
    public void disableStore(@RequestParam int storeId) {
        storeService.disableStore(storeId);
    }

    @GetMapping("/store")
    public StoresResponse get(FilterStoresRequest request) {
        return storeService.administratorGet(request);
    }

    @GetMapping("/store/{storeId}")
    public StoreResponse getById(@PathVariable int storeId) {
        return storeService.getById(storeId);
    }
}
