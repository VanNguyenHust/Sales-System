package vn.hust.omni.sale.service.store.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.store.application.constant.StoreFeatures;
import vn.hust.omni.sale.service.store.application.model.store_features.StoreFeaturesResponse;
import vn.hust.omni.sale.service.store.domain.model.StoreFeature;
import vn.hust.omni.sale.service.store.domain.repository.JpaStoreFeatureRepository;
import vn.hust.omni.sale.service.store.domain.repository.JpaStoreRepository;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreFeatureService {
    private final JpaStoreRepository storeRepository;
    private final JpaStoreFeatureRepository storeFeatureRepository;

    public StoreFeaturesResponse get(int storeId) {
        var storeFeatures = storeFeatureRepository.getAllByStoreId(storeId);

        var features = storeFeatures.stream()
                .collect(Collectors.toMap(StoreFeature::getFeatureKey, StoreFeature::isEnable));

        return StoreFeaturesResponse.builder()
                .features(features)
                .build();
    }

    public void enable(int storeId, String featureKey) {
        if (StoreFeatures.getStoreFeatures().keySet().stream().noneMatch(featureKey::equals)) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Tính năng không tồn tại.")
                            .fields(List.of("featureKey"))
                            .build()
            );
        }

        if (!storeRepository.existsById(storeId)) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Cửa hàng không tồn tại.")
                            .fields(List.of("storeId"))
                            .build()
            );
        }

        var storeFeature = storeFeatureRepository.findByStoreIdAndFeatureKey(storeId, featureKey)
                .orElseGet(() -> {
                    var newStoreFeature = new StoreFeature();
                    newStoreFeature.setStoreId(storeId);
                    newStoreFeature.setFeatureKey(featureKey);
                    return newStoreFeature;
                });

        storeFeature.setEnable(true);

        storeFeatureRepository.save(storeFeature);
    }

    public void disable(int storeId, String featureKey) {
        if (!storeRepository.existsById(storeId)) {
            throw new ConstraintViolationException(
                    UserError.builder()
                            .message("Cửa hàng không tồn tại.")
                            .fields(List.of("storeId"))
                            .build()
            );
        }

        var storeFeature = storeFeatureRepository.findByStoreIdAndFeatureKey(storeId, featureKey)
                .orElseThrow(() -> new ConstraintViolationException(
                        UserError.builder()
                                .message("Tính năng không tồn tại.")
                                .fields(List.of("featureKey"))
                                .build()
                ));

        storeFeature.setEnable(false);

        storeFeatureRepository.save(storeFeature);
    }
}
