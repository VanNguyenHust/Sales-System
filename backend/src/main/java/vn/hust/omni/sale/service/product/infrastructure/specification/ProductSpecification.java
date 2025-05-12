package vn.hust.omni.sale.service.product.infrastructure.specification;

import org.springframework.data.jpa.domain.Specification;
import vn.hust.omni.sale.service.product.domain.model.Product;
import vn.hust.omni.sale.service.product.domain.model.ProductTag_;
import vn.hust.omni.sale.service.product.domain.model.Product_;

import java.util.List;

public class ProductSpecification {
    public static Specification<Product> hasStoreId(int storeId) {
        return (root, query, cb) -> cb.equal(root.get(Product_.STORE_ID), storeId);
    }

    public static Specification<Product> hasProductIds(List<Integer> productIds) {
        return (root, query, cb) -> root.get(Product_.ID).in(productIds);
    }

    public static Specification<Product> hasTags(List<String> tags) {
        return (root, query, cb) -> root.join(Product_.TAGS).get(ProductTag_.NAME).in(tags);
    }
}
