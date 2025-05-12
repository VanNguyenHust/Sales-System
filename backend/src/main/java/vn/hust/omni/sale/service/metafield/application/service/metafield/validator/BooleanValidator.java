package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;

import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;

import java.util.List;

public class BooleanValidator extends Validator {
    @Override
    public String validate(String type, String value, List<MetafieldDefinitionValidation> validations, int storeId) {
        if (!"true".equals(value) && !"false".equals(value) && !"1".equals(value) && !"0".equals(value)) {
            return "Value must be true or false.";
        }
        return "";
    }
}
