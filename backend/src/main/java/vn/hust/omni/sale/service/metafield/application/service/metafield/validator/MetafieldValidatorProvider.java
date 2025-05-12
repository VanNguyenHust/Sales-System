package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import vn.hust.omni.sale.service.customer.application.service.CustomerService;
import vn.hust.omni.sale.service.product.application.service.ProductReadService;

@Getter
public class MetafieldValidatorProvider {
    private final BooleanValidator booleanValidator;
    private final DateTimeValidator dateTimeValidator;
    private final NumberDecimalValidator numberDecimalValidator;
    private final TextFieldValidator textFieldValidator;
    private final ObjectReferenceValidator objectReferenceValidator;

    public MetafieldValidatorProvider(ObjectMapper json, CustomerService customerService, ProductReadService productService) {
        this.booleanValidator = new BooleanValidator();
        this.dateTimeValidator = new DateTimeValidator();
        this.numberDecimalValidator = new NumberDecimalValidator();
        this.textFieldValidator = new TextFieldValidator(json);
        this.objectReferenceValidator = new ObjectReferenceValidator(json, customerService, productService);
    }
}

