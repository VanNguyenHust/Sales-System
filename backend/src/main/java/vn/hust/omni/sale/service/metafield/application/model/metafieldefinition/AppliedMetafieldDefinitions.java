package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldResponse;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonRootName("applied_metafield_definition")
public class AppliedMetafieldDefinitions {
    private MetafieldDefinitionResponse metafieldDefinition;
    private MetafieldResponse metafield;

    public AppliedMetafieldDefinitions(MetafieldDefinitionResponse metafieldDefinition) {
        this.metafieldDefinition = metafieldDefinition;
    }
}
