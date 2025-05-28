package vn.hust.omni.sale.service.product.application.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class InventoriesResponse {
    private List<InventoryResponse> inventories;
}
