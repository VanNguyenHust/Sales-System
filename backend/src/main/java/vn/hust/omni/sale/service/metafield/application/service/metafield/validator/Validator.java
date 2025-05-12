package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;


import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;

import java.util.List;

public abstract class Validator {
    public abstract String validate(String type, String value, List<MetafieldDefinitionValidation> validations, int storeId);
}