package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MetafieldDefinitionFilterResponse {
    private String filterParam;
    private String namespace;
    private String key;
    private String type;
    private MetafieldDefinitionOwnerType ownerResource;
    private int id;
    private Boolean allowMultiple;
    private String name;
    private String typeFilter;
}
