package vn.hust.omni.sale.service.metafield.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;

import java.util.Optional;

public interface JpaMetafieldDefinitionRepository extends JpaRepository<MetafieldDefinition, Integer> {
    int countByStoreId(int storeId);

    Optional<MetafieldDefinition> findByStoreIdAndKeyAndNamespaceAndOwnerResource(int storeId, String key,
                                                                                  String namespace,
                                                                                  MetafieldDefinitionOwnerType ownerResource);

    Optional<MetafieldDefinition> findByStoreIdAndId(int storeId, int id);
}
