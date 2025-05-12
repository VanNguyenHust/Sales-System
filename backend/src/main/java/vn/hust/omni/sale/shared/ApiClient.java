package vn.hust.omni.sale.shared;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldResponse;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldSet;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldService;
import vn.hust.omni.sale.service.product.application.model.ProductFilterRequest;
import vn.hust.omni.sale.service.product.application.service.ProductReadService;
import vn.hust.omni.sale.service.store.application.model.store.administrator.StoreResponse;
import vn.hust.omni.sale.service.store.application.service.StoreService;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ApiClient {
    private final StoreService storeService;
    private final MetafieldService metafieldService;
    private final ProductReadService productReadService;

    public StoreResponse storeGetById(int storeId) {
        return storeService.getStoreById(storeId);
    }

    public List<MetafieldResponse> metafieldSets(int storeId, List<MetafieldSet> metafields) {
        return metafieldService.sets(storeId, metafields);
    }

    public long filterCountProduct(int storeId, ProductFilterRequest filter) {
        return productReadService.count(storeId, filter);
    }
}
