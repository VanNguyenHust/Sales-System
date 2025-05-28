package vn.hust.omni.sale.service.store.infrastructure.specification;

import org.springframework.data.jpa.domain.Specification;
import vn.hust.omni.sale.service.store.domain.model.Location;
import vn.hust.omni.sale.service.store.domain.model.Location_;

public class LocationSpecification {
    public static Specification<Location> hasStoreId(int storeId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(Location_.STORE_ID), storeId);
    }

    public static Specification<Location> hasName(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get(Location_.NAME)), "%" + name.toLowerCase() + "%");
    }
}
