package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@JsonRootName("count")
@AllArgsConstructor
@Getter
@Setter
public class MetafieldDefinitionCountResponse {
    private int count;
    private String ownerResource;
}
