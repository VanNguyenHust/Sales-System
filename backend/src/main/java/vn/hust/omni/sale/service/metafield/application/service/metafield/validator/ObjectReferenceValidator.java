package vn.hust.omni.sale.service.metafield.application.service.metafield.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import vn.hust.omni.sale.service.customer.application.service.CustomerService;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;
import vn.hust.omni.sale.service.product.application.service.ProductReadService;

import java.util.List;

public class ObjectReferenceValidator extends JsonValidator {
    private final CustomerService customerService;
    private final ProductReadService productService;

    public ObjectReferenceValidator(ObjectMapper json, CustomerService customerService, ProductReadService productService) {
        super(json);
        this.customerService = customerService;
        this.productService = productService;
    }

    @Override
    public String validate(String type, String value, List<MetafieldDefinitionValidation> validations, int storeId) {
        return getObjectReferenceByType(type, value, storeId);
    }

    public String getObjectReferenceByType(String type, String id, int storeId) {
        var messageError = "Value must be a valid " + type.replace("_reference", "") + " reference.";
        try {
            switch (type) {
                case "product_reference" -> productService.getById(Integer.parseInt(id), storeId);
                default -> {
                    return messageError;
                }
            }
            return "";
        } catch (Exception e) {
            return messageError;
        }
    }

}
