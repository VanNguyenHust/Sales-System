package vn.hust.omni.sale.service.product.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import vn.hust.omni.sale.service.product.domain.model.Product;

import java.util.Optional;

public interface JpaProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByAliasAndStoreId(String alias, int storeId);

    Product getByIdAndStoreId(int id, int storeId);
}
