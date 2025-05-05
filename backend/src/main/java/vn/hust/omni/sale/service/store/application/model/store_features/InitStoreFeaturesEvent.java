package vn.hust.omni.sale.service.store.application.model.store_features;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InitStoreFeaturesEvent {
    private long storeId;
}
