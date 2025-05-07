package vn.hust.omni.sale.service.metafield.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionCreateRequest;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionResponse;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionUpdateRequest;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;

@Mapper(componentModel = "spring")
public interface MetafieldDefinitionMapper {
    MetafieldDefinitionResponse toResponse(MetafieldDefinition entity);

    MetafieldDefinitionCreateRequest copyMetafieldDefinitionCreateRequest(MetafieldDefinitionUpdateRequest request, String type);
}
