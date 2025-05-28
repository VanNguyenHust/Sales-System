package vn.hust.omni.sale.service.product.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.hust.omni.sale.service.product.domain.model.Product;

import java.util.List;
import java.util.Optional;

public interface JpaProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByAliasAndStoreId(String alias, int storeId);

    Product getByIdAndStoreId(int id, int storeId);

    @EntityGraph(attributePaths = {
            "images",
            "pricingInfo",
            "tags"
    })
    List<Product> findAll(Specification<Product> spec);

    @EntityGraph(attributePaths = {
            "images",
            "pricingInfo",
            "tags"
    })
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);
}
