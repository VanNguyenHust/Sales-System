package vn.hust.omni.sale.service.metafield.infrastructure.specification;

import org.springframework.data.jpa.domain.Specification;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation_;

public class MetafieldDefinitionValidationSpecification {
    public static Specification<MetafieldDefinitionValidation> hasDefinitionId(int metafieldDefinitionId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(MetafieldDefinitionValidation_.DEFINITION).get(MetafieldDefinitionValidation_.ID), metafieldDefinitionId);
    }

    public static Specification<MetafieldDefinitionValidation> hasStoreId(int storeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(MetafieldDefinitionValidation_.STORE_ID), storeId);
    }
}
