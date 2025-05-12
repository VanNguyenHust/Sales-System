package vn.hust.omni.sale.service.metafield.infrastructure.specification;

import jakarta.persistence.criteria.Predicate;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionFilterRequest;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition_;

import java.util.ArrayList;

public class MetafieldDefinitionSpecification {
    public static Specification<MetafieldDefinition> ofFilter(int storeId, MetafieldDefinitionFilterRequest request) {
        return ((root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();
            predicates.add(cb.equal(root.get(MetafieldDefinition_.STORE_ID), storeId));
            predicates.add(cb.equal(root.get(MetafieldDefinition_.OWNER_RESOURCE), request.getOwnerResource()));

            if (request.getPin() != null) {
                predicates.add(cb.equal(root.get(MetafieldDefinition_.PIN), request.getPin()));
            }

            if (StringUtils.isNoneEmpty(request.getNamespace())) {
                predicates.add(cb.equal(root.get(MetafieldDefinition_.NAMESPACE), request.getNamespace()));
            }

            if (StringUtils.isNoneEmpty(request.getKey())) {
                predicates.add(cb.equal(root.get(MetafieldDefinition_.KEY), request.getKey()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }

    public static Specification<MetafieldDefinition> hasStoreId(int storeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(MetafieldDefinition_.STORE_ID), storeId);
    }

    public static Specification<MetafieldDefinition> hasOwnerResource(MetafieldDefinitionOwnerType ownerResource) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(MetafieldDefinition_.OWNER_RESOURCE), ownerResource);
    }
}
