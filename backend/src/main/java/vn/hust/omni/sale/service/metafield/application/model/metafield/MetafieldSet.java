package vn.hust.omni.sale.service.metafield.application.model.metafield;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import vn.hust.omni.sale.shared.common_validator.annotation.StringInList;

import java.util.Optional;

@Setter
@Getter
@AllArgsConstructor
public class MetafieldSet {

    private Optional<Integer> id;

    private @NotNull
    @NotBlank
    @Size(max = 64) String key;

    private @NotNull
    @NotBlank
    @Size(max = 255) String namespace;

    private @NotNull
    @NotBlank String value;

    @NotNull
    @StringInList(array = {"boolean", "date_time", "number_decimal", "single_line_text_field"})
    private String valueType;

    private @NotNull Integer ownerId;

    @NotNull
    @StringInList(array = {"product", "order", "customer"})
    private String ownerResource;
}
