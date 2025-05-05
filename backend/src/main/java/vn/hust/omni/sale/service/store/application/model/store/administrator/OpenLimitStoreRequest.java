package vn.hust.omni.sale.service.store.application.model.store.administrator;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OpenLimitStoreRequest {
    private Integer maxProduct;

    private Integer maxLocation;

    private Integer maxUser;
}
