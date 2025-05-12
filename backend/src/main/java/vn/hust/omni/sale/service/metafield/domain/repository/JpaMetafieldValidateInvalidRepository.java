package vn.hust.omni.sale.service.metafield.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldValidateInvalid;

import java.util.List;

public interface JpaMetafieldValidateInvalidRepository extends JpaRepository<MetafieldValidateInvalid, Integer>, JpaSpecificationExecutor<MetafieldValidateInvalid> {
    @Transactional
    void deleteByStoreIdAndDefinitionId(int storeId, int definitionId);

    int countByStoreIdAndDefinitionId(int storeId, int definitionId);

    List<MetafieldValidateInvalid> findByStoreIdAndDefinitionIdIn(int storeId, List<Integer> definitionIds);

    List<MetafieldValidateInvalid> findByStoreIdAndDefinitionId(int storeId, int definitionId);

    MetafieldValidateInvalid findByStoreIdAndDefinitionIdAndMetafieldId(int storeId, int definitionId,
                                                                        int metafieldId);
}
