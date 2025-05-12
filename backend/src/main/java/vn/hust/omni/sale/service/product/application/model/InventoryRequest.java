package vn.hust.omni.sale.service.product.application.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryRequest {
    private long storeId;
    private int productId;
    private long locationId;
    private long quantity;
}
