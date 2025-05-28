package vn.hust.omni.sale.service.metafield.domain.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;

import java.util.List;
import java.util.Map;

public interface JpaMetafieldRepository extends JpaRepository<Metafield, Integer>, JpaSpecificationExecutor<Metafield> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Metafield m WHERE m.storeId = ?1 AND m.ownerResource = ?2 AND m.namespace = ?3 AND m.key = ?4")
    void deleteByDefinition(int storeId, String ownerResource, String namespace, String key);

    Metafield findByNamespaceAndKeyAndOwnerResourceAndOwnerIdAndStoreId(String key, String namespace, String ownerResource, int ownerId, int storeId);

    Metafield findByIdAndStoreId(int id, int storeId);

    @Query("SELECT m.namespace, m.key, m.ownerResource, COUNT(m) " +
           "FROM Metafield m " +
           "WHERE m.storeId = ?1 AND m.namespace IN ?2 AND m.key IN ?3 AND m.ownerResource IN ?4 " +
           "GROUP BY m.namespace, m.key, m.ownerResource")
    List<Object[]> filterCountsByNamespaceAndKeyAndOwnerResource(int storeId, List<String> namespaces, List<String> keys, List<String> ownerResources);

    Integer countByStoreIdAndNamespaceAndKeyAndOwnerResource(int storeId, String namespace, String key, String ownerResource);
}
