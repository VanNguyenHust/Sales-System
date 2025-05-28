package vn.hust.omni.sale.service.product.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.product.application.model.InventoryRequest;
import vn.hust.omni.sale.service.product.application.model.InventoryResponse;
import vn.hust.omni.sale.service.product.domain.model.InventoryLevel;

@Mapper(componentModel = "spring")
public interface InventoryMapper {
    InventoryLevel toEntity(InventoryRequest request);

    InventoryResponse toResponse(InventoryLevel inventoryLevel);
}
