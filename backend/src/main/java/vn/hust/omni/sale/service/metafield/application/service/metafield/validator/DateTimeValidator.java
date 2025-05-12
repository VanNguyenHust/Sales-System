package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NoArgsConstructor;
import vn.hust.omni.sale.service.metafield.application.constant.MetafieldDefinitionTypeConstant;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldService;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;

import java.util.List;

@NoArgsConstructor
public class DateTimeValidator extends JsonValidator {
    public DateTimeValidator(ObjectMapper json) {
        super(json);
    }

    @Override
    public String validate(String type, String value, List<MetafieldDefinitionValidation> validations, int storeId) {
        var messageError = "Value must be in “YYYY-MM-DDTHH:MM:SS” format. For example: 2022-06-01T15:30:00";
        if (value == null) return messageError;
        var dateTimeValue = MetafieldService.dateParseByFormat(value, true);
        if (dateTimeValue == null) {
            return messageError;
        } else {
            if (validations != null) {
                return compareValidationMinMaxByType(validations, dateTimeValue,
                        MetafieldDefinitionTypeConstant.DATE_TIME);
            }
        }
        return "";
    }
}
