package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonRootName("metafield_definition")
public class MetafieldDefinitionUpdateRequest {

    private @Size(max = 320) String name;

    private @Size(max = 100) String description;

    @NotBlank
    @Size(min = 3, max = 64)
    @Pattern(regexp = "([A-Za-z0-9\\-\\_]+)")
    private String key;

    @NotBlank
    @Size(min = 3, max = 255)
    @Pattern(regexp = "([A-Za-z0-9\\-\\_]+)")
    private String namespace;

    @NotNull
    private MetafieldDefinitionOwnerType ownerResource;

    private Boolean pin;

    private List<MetafieldDefinitionValidationRequest> validations;
}

