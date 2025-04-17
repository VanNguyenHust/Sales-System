package vn.hust.omni.sale.service.store.domain.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import vn.hust.omni.sale.service.store.domain.model.StoreFeature;

import java.util.List;

public interface JpaStoreFeatureRepository extends JpaRepository<StoreFeature, Long> {
    List<StoreFeature> getAllByStoreId(long storeId);

    StoreFeature getByStoreIdAndFeatureKey(long storeId, String featureKey);
}
