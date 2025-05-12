package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;

import java.util.List;
import java.util.regex.Pattern;

public class TextFieldValidator extends JsonValidator {
    public TextFieldValidator(ObjectMapper json) {
        super(json);
    }

    @Override
    public String validate(String type, String value, List<MetafieldDefinitionValidation> validations, int storeId) {
        var messageError = "";
        try {
            super.checkMaxSize(value);
        } catch (ValidationException e) {
            messageError = "Value can't exceed 65536 characters.";
        }
        if ("single_line_text_field".equals(type) && value.contains("\n")) {
            messageError = "Value must be a single line text string.";
        } else {
            if (validations != null) {
                messageError = validateMultiAndSingleLineTextFieldByDefinition(validations, value);
            }
        }
        return messageError;
    }

    private String validateMultiAndSingleLineTextFieldByDefinition(List<MetafieldDefinitionValidation> validations,
                                                                   String value) {
        var resultErrorMessage = "";

        var checkValidateMinMax =
                validations.stream().filter(x -> "min".equals(x.getName()) || "max".equals(x.getName())).findAny();
//        if (checkValidateMinMax.isPresent())
//            resultErrorMessage = compareValidationMinMaxByType(validations,
//                    String.valueOf(value.length()),
//                    MetafieldDefinitionTypeConstant.NUMBER_INTEGER);

        if (resultErrorMessage.isEmpty()) {
            var checkValidateChoices =
                    validations.stream().filter(x -> "choices".equals(x.getName())).findFirst();
            if (checkValidateChoices.isPresent())
                resultErrorMessage = validationChoices(checkValidateChoices.get(), value);
        }

        if (resultErrorMessage.isEmpty()) {
            var checkValidateRegex =
                    validations.stream().filter(x -> "regex".equals(x.getName())).findFirst();
            resultErrorMessage = checkValidateRegex.map(validation -> validationRegex(validation, value)).orElse("");
        }

        return resultErrorMessage;
    }

    private String validationChoices(MetafieldDefinitionValidation validation, String value) {
        try {
            var listString = json.getTypeFactory().constructParametricType(List.class, String.class);
            List<String> choices = json.readValue(validation.getValue(), listString);
            var choicesValid = choices.stream().filter(c -> c.trim().equals(value.trim())).toList();
            if (choicesValid.isEmpty()) {
                return String.format("Value does not exist in the options provided: %s.", validation.getValue());
            }
        } catch (Exception ignored) {
        }
        return "";
    }

    private String validationRegex(MetafieldDefinitionValidation validation, String value) {
        try {
            String regex = validation.getValue();
            if (!Pattern.matches(regex, value))
                return "Value is not the correct format";
        } catch (Exception ignored) {
        }
        return "";
    }
}
