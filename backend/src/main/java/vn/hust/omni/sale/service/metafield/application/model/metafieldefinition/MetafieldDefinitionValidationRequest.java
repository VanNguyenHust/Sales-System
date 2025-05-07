package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class MetafieldDefinitionValidationRequest {
    @NotNull
    @NotBlank
    private String name;
    @NotNull
    @NotBlank
    private String value;
}
