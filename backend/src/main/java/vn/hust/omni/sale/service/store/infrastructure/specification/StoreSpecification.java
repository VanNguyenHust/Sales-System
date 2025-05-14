package vn.hust.omni.sale.service.store.infrastructure.specification;

import org.springframework.data.jpa.domain.Specification;
import vn.hust.omni.sale.service.store.domain.model.Store;
import vn.hust.omni.sale.service.store.domain.model.Store_;

public class StoreSpecification {
    public static Specification<Store> filterStoreTrash() {
        return (root, query, cb) -> cb.and(cb.equal(root.get(Store_.STATUS), 0));
    }

    public static Specification<Store> hasName(String name) {
        return (root, query, cb) -> cb.like(root.get(Store_.NAME), "%" + name + "%");
    }

    public static Specification<Store> hasProvince(String province) {
        return (root, query, cb) -> cb.equal(root.get(Store_.PROVINCE), province);
    }

    public static Specification<Store> hasStatus(int status) {
        return (root, query, cb) -> cb.equal(root.get(Store_.STATUS), status);
    }

    public static Specification<Store> hasPhoneNumber(String phoneNumber) {
        return (root, query, cb) -> cb.like(root.get(Store_.PHONE_NUMBER), "%" + phoneNumber + "%");
    }

    public static Specification<Store> hasEmail(String email) {
        return (root, query, cb) -> cb.like(root.get(Store_.EMAIL), "%" + email + "%");
    }

    public static Specification<Store> hasStoreOwner(String storeOwner) {
        return (root, query, cb) -> cb.like(root.get(Store_.STORE_OWNER), "%" + storeOwner + "%");
    }
}
