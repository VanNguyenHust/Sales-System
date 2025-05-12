package vn.hust.omni.sale.service.metafield.infrastructure.specification;

import org.springframework.data.jpa.domain.Specification;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield_;

import java.util.List;

public class MetafieldSpecification {
    public static Specification<Metafield> filterBatch(int storeId, int ownerId,
                                                       String ownerResourceType,
                                                       List<String> keys, List<String> namespaces) {
        return (root, query, criteriaBuilder) -> {
            var predicates = criteriaBuilder.and(
                    criteriaBuilder.equal(root.get(Metafield_.STORE_ID), storeId),
                    criteriaBuilder.equal(root.get(Metafield_.OWNER_ID), ownerId),
                    criteriaBuilder.equal(root.get(Metafield_.OWNER_RESOURCE), ownerResourceType)
            );

            if (keys != null && !keys.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, root.get(Metafield_.KEY).in(keys));
            }

            if (namespaces != null && !namespaces.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, root.get(Metafield_.NAMESPACE).in(namespaces));
            }

            return predicates;
        };
    }

    public static Specification<Metafield> hasStoreId(int storeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Metafield_.STORE_ID), storeId);
    }

    public static Specification<Metafield> hasIdsIn(List<Integer> ids) {
        return (root, query, criteriaBuilder) -> root.get(Metafield_.ID).in(ids);
    }

    public static Specification<Metafield> hasOwnerResource(String ownerResource) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Metafield_.OWNER_RESOURCE), ownerResource);
    }

    public static Specification<Metafield> hasOwnerId(int ownerId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Metafield_.OWNER_ID), ownerId);
    }

    public static Specification<Metafield> hasKey(String key) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Metafield_.KEY), key);
    }

    public static Specification<Metafield> hasNamespace(String namespace) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Metafield_.NAMESPACE), namespace);
    }

    public static Specification<Metafield> hasKeysIn(List<String> keys) {
        return (root, query, criteriaBuilder) -> root.get(Metafield_.KEY).in(keys);
    }

    public static Specification<Metafield> hasNamespacesIn(List<String> namespaces) {
        return (root, query, criteriaBuilder) -> root.get(Metafield_.NAMESPACE).in(namespaces);
    }
}
