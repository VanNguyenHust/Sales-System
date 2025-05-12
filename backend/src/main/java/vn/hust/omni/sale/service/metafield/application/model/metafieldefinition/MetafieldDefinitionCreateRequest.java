package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.shared.common_validator.annotation.StringInList;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonRootName("metafield_definition")
public class MetafieldDefinitionCreateRequest {

    @NotBlank
    @Size(max = 320)
    private String name;

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

    @StringInList(array = {"boolean", "date_time", "number_decimal", "single_line_text_field"})
    private String type;

    private List<MetafieldDefinitionValidationRequest> validations;
}
