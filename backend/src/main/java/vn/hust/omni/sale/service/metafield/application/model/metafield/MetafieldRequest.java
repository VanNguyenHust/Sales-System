package vn.hust.omni.sale.service.metafield.application.model.metafield;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.hust.omni.sale.shared.common_validator.annotation.StringInList;

import java.util.Optional;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class MetafieldRequest {

    private Optional<Integer> id;

    private Optional<@NotBlank @Size(max = 64) String> key;

    private Optional<@NotBlank @Size(max = 255) String> namespace;

    private Optional<@NotBlank String> value;

    private Optional<
            @StringInList(array = {"boolean", "date_time", "number_decimal", "single_line_text_field"})
            @NotBlank String> valueType;
}
