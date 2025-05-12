package vn.hust.omni.sale.service.metafield.application.service.mapper;

import org.mapstruct.Mapper;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionCreateRequest;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionFilterResponse;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionResponse;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionUpdateRequest;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MetafieldDefinitionMapper {
    ArrayList<MetafieldDefinitionResponse> fromEntitysToResponses(List<MetafieldDefinition> metafieldDefinitions);

    MetafieldDefinitionResponse toResponse(MetafieldDefinition entity);

    MetafieldDefinitionCreateRequest copyMetafieldDefinitionCreateRequest(MetafieldDefinitionUpdateRequest request, String type);

    ArrayList<MetafieldDefinitionFilterResponse> fromEntitysToMetafieldDefinitionFilters(List<MetafieldDefinition> metafieldDefinitions);
}
