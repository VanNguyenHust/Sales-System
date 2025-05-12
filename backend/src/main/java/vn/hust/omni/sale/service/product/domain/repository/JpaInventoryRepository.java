package vn.hust.omni.sale.service.product.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.product.domain.model.InventoryLevel;

public interface JpaInventoryRepository extends JpaRepository<InventoryLevel, Integer> {
}
