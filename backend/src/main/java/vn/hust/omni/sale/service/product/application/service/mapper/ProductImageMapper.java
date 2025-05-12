package vn.hust.omni.sale.service.product.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.product.application.model.ProductImageRequest;
import vn.hust.omni.sale.service.product.application.model.ProductImageResponse;
import vn.hust.omni.sale.service.product.domain.model.ProductImage;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {
    ProductImageResponse toResponse(ProductImage productImage);

}
