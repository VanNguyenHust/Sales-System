package vn.hust.omni.sale.service.store.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.store.application.model.store.administrator.StoreResponse;
import vn.hust.omni.sale.service.store.domain.model.Store;

@Mapper(componentModel = "spring")
public interface StoreMapper {
    StoreResponse toResponse(Store store);
}
