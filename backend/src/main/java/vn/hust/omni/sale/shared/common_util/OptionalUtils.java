package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Optional;
import java.util.function.Supplier;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class OptionalUtils {

    /**
     * Get value of nullable optional
     */
    public static <T> T getValue(Optional<T> optional) {
        if (Optional.ofNullable(optional).isPresent()) {
            return optional.orElse(null);
        }
        return null;
    }

    /**
     * Get value of nullable optional
     */
    public static <T> T getValue(Optional<T> optional, T defaultValue) {
        if (Optional.ofNullable(optional).isPresent()) {
            return optional.orElse(defaultValue);
        }
        return defaultValue;
    }

    /**
     * Check optional has value is null or not
     */
    public static boolean hasValue(Optional<?> optional) {
        return Optional.ofNullable(optional).isPresent();
    }

    private static Supplier<Object> NULL_SUPPLIER = () -> null;

    public static <T> T valueOrDefault(Optional<T> optional, Supplier<T> defaultValueSupplier) {
        if (defaultValueSupplier == null)
            defaultValueSupplier = (Supplier<T>) NULL_SUPPLIER;
        return optional == null
                ? defaultValueSupplier.get()
                : optional.orElse(defaultValueSupplier.get());
    }
}
