package vn.hust.omni.sale.service.product.application.model;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class InventoryResponse {
    private long storeId;
    private int productId;
    private long locationId;
    private BigDecimal quantity;
    private BigDecimal saleAvailable;
}
