package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import lombok.Builder;
import lombok.Data;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;

import java.util.List;

@Data
@Builder
public class MetafieldDefinitionResponse {
    private int id;
    private String description;
    private String key;
    private String name;
    private String namespace;
    private String type;
    private MetafieldDefinitionOwnerType ownerResource;
    private boolean pin;
    private int metafieldsCount;
    private int invalidMetafieldsCount;
//    private List<MetafieldDefinitionValidationResponse> validations;
//    private MetafieldDefinitionValidationStatus validationStatus;
}
