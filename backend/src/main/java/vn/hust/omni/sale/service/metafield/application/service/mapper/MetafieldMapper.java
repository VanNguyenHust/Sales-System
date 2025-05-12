package vn.hust.omni.sale.service.metafield.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldResponse;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;

@Mapper(componentModel = "spring")
public interface MetafieldMapper {
    MetafieldResponse toResponse(Metafield metafield);

    MetafieldResponse fromEntityToResponse(Metafield metafield);
}
