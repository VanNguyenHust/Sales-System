package vn.hust.omni.sale.service.store.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.hust.omni.sale.service.store.application.model.store_features.StoreFeaturesResponse;
import vn.hust.omni.sale.service.store.application.service.StoreFeatureService;
import vn.hust.omni.sale.shared.security.StoreId;

@RestController
@RequestMapping("/admin/store_feature")
@RequiredArgsConstructor
public class StoreFeatureController {
    private final StoreFeatureService storeFeatureService;

    @GetMapping
    public StoreFeaturesResponse getStoreFeatures(@StoreId int storeId) {
        return storeFeatureService.get(storeId);
    }
}
