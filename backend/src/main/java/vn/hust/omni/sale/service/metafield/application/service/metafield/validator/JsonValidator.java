package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import vn.hust.omni.sale.service.metafield.application.constant.MetafieldDefinitionTypeConstant;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public abstract class JsonValidator extends Validator {
    protected ObjectMapper json;
    private static final int MAX_SIZE_BYTES = 65536;

    public <T> T parseJson(String value, Class<T> valueType) throws ValidationException {
        try {
            checkMaxSize(value.toString());
            return json.readValue(value, valueType);
        } catch (Exception e) {
            throw new ValidationException("Value is invalid JSON.");
        }
    }

    public <T> T parseJson(String value, JavaType valueType) throws ValidationException {
        List<T> list;
        try {
            list = json.readValue(value, valueType);
        } catch (Exception e) {
            throw new ValidationException("Value is invalid JSON.");
        }
        if (list.size() > 128) {
            throw new ValidationException("Value has more than 128 elements.");
        }
        for (T item : list) {
            checkMaxSize(item.toString());
        }
        return (T) list;
    }

    public String compareValidationMinMaxByType(List<MetafieldDefinitionValidation> validations,
                                                String value,
                                                String valueType) {
        try {
            String min = null;
            String max = null;
            var invalidMin = false;
            var invalidMax = false;
            for (var validation : validations.stream().filter(x -> List.of("min", "max").contains(x.getName())).toList()) {
                if ("min".equals(validation.getName())) {
                    min = validation.getValue();
                }
                if ("max".equals(validation.getName())) {
                    max = validation.getValue();
                }
            }
            if (min != null || max != null) {
                if (valueType.equals(MetafieldDefinitionTypeConstant.NUMBER_DECIMAL)) {
                    if (min != null) invalidMin = Double.parseDouble(value) < Double.parseDouble(min);
                    if (max != null) invalidMax = Double.parseDouble(value) > Double.parseDouble(max);
                }
                if (valueType.equals(MetafieldDefinitionTypeConstant.DATE_TIME)) {
                    SimpleDateFormat dateFormat = new SimpleDateFormat(
                            valueType.equals(MetafieldDefinitionTypeConstant.DATE_TIME) ?
                                    "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd"
                    );
                    var dateValue = dateFormat.parse(value.trim());
                    if (min != null) {
                        var dateMin = dateFormat.parse(min);
                        invalidMin = dateValue.before(dateMin);
                    }
                    if (max != null) {
                        var dateMax = dateFormat.parse(max);
                        invalidMax = dateValue.after(dateMax);
                    }
                }
            }
            if (invalidMin) return "Value has a minimum of " + min;
            if (invalidMax) return "Value has a maximum of " + max;

        } catch (Exception ignored) {
        }
        return "";
    }

    protected void checkMaxSize(String value) throws ValidationException {
        if (value.getBytes(StandardCharsets.UTF_8).length > MAX_SIZE_BYTES) {
            throw new ValidationException("Value can't exceed 65536 characters.");
        }
    }
}
