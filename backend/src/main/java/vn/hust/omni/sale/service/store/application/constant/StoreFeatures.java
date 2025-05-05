package vn.hust.omni.sale.service.store.application.constant;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum StoreFeatures {
    omni_channel(true),
    manage_metafield_definitions(false);

    private boolean defaultValue;

    public boolean getDefaultValue() {
        return defaultValue;
    }

    StoreFeatures(boolean defaultValue) {
        this.defaultValue = defaultValue;
    }

    public static Map<String, Boolean> getStoreFeatures() {
        return Stream.of(StoreFeatures.values())
                .collect(Collectors.toMap(Enum::name, StoreFeatures::getDefaultValue));
    }
}
