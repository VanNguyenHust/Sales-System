package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NoArgsConstructor;
import vn.hust.omni.sale.service.metafield.application.constant.MetafieldDefinitionTypeConstant;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
public class NumberDecimalValidator extends JsonValidator {
    private static final BigDecimal LOWER_BOUND = new BigDecimal("-99999999999999.999999999");
    private static final BigDecimal UPPER_BOUND = new BigDecimal("99999999999999.999999999");

    public NumberDecimalValidator(ObjectMapper json) {
        super(json);
    }

    @Override
    public String validate(String type, String value, List<MetafieldDefinitionValidation> validations, int storeId) {
        var messageError = "";
        if (!isValidDecimal(value)) {
            messageError = "Value invalid decimal.";
        } else {
            if (validations != null) {
                messageError = compareValidationMinMaxByType(
                        validations,
                        value,
                        MetafieldDefinitionTypeConstant.NUMBER_DECIMAL
                );
                if (messageError.isEmpty())
                    messageError = validateMaxPrecision(
                            validations,
                            value
                    );
            }
        }
        return messageError;
    }

    private String validateMaxPrecision(List<MetafieldDefinitionValidation> validations, String value) {
        var maxPrecisionOptional = validations.stream().filter(x -> "max_precision".equals(x.getName())).findFirst();
        if (maxPrecisionOptional.isEmpty()) return "";
        var maxPrecision = maxPrecisionOptional.get();
        var maxPrecisionValue = Integer.parseInt(maxPrecision.getValue());
        int decimalPlaces;
        if (value.contains(".")) {
            decimalPlaces = value.split("\\.")[1].length();
            if (decimalPlaces > maxPrecisionValue)
                return String.format("Value can't exceed %s decimal places.", maxPrecisionValue);
        }
        return "";
    }

    private boolean isValidDecimal(String value) {
        try {
            value = value.trim();
            var valueParse = new BigDecimal(value);
            return valueParse.compareTo(LOWER_BOUND) >= 0 && valueParse.compareTo(UPPER_BOUND) <= 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
