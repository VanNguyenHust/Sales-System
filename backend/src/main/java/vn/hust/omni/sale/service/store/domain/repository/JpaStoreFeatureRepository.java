package vn.hust.omni.sale.service.store.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.store.domain.model.StoreFeature;

import java.util.List;
import java.util.Optional;

public interface JpaStoreFeatureRepository extends JpaRepository<StoreFeature, Long> {
    List<StoreFeature> getAllByStoreId(long storeId);

    Optional<StoreFeature> findByStoreIdAndFeatureKey(long storeId, String featureKey);
}
