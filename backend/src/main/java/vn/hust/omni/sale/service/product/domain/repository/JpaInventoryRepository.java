package vn.hust.omni.sale.service.product.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.product.domain.model.InventoryLevel;

import java.util.List;

public interface JpaInventoryRepository extends JpaRepository<InventoryLevel, Integer> {
    List<InventoryLevel> findByStoreIdAndProductId(long storeId, int productId);
}
