package vn.hust.omni.sale.service.store.job;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.store.application.constant.StoreFeatures;
import vn.hust.omni.sale.service.store.application.model.store_features.InitStoreFeaturesEvent;
import vn.hust.omni.sale.service.store.domain.model.StoreFeature;
import vn.hust.omni.sale.service.store.domain.repository.JpaStoreFeatureRepository;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class StoreFeatureEventService {
    private final JpaStoreFeatureRepository storeFeatureRepository;

    @Async
    @EventListener
    public void handleInitStoreFeaturesEvent(InitStoreFeaturesEvent event) {
        var storeId = event.getStoreId();
        var features = StoreFeatures.getStoreFeatures();

        var storeFeatures = new ArrayList<StoreFeature>();
        for (var feature : features.entrySet()) {
            var storeFeature = storeFeatureRepository.findByStoreIdAndFeatureKey(storeId, feature.getKey());
            if (storeFeature.isEmpty()) {
                var newStoreFeature = new StoreFeature();
                newStoreFeature.setStoreId(storeId);
                newStoreFeature.setFeatureKey(feature.getKey());
                newStoreFeature.setEnable(feature.getValue());

                storeFeatures.add(newStoreFeature);
            }
        }

        storeFeatureRepository.saveAll(storeFeatures);
    }
}
