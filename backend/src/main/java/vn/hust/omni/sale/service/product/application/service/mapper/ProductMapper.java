package vn.hust.omni.sale.service.product.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.product.application.model.ProductResponse;
import vn.hust.omni.sale.service.product.domain.model.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toResponse(Product product);
}
