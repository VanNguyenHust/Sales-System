package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonRootName("validation")
public class MetafieldDefinitionValidationResponse {
    private String name;
    private String value;
}
