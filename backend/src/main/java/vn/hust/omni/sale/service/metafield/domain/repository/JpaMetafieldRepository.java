package vn.hust.omni.sale.service.metafield.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;

public interface JpaMetafieldRepository extends JpaRepository<Metafield, Integer> {
}
