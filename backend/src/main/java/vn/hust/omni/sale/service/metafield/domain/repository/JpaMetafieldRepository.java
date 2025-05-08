package vn.hust.omni.sale.service.metafield.domain.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;

public interface JpaMetafieldRepository extends JpaRepository<Metafield, Integer> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Metafield m WHERE m.storeId = ?1 AND m.ownerResource = ?2 AND m.namespace = ?3 AND m.key = ?4")
    void deleteByDefinition(int storeId, String ownerResource, String namespace, String key);
}
