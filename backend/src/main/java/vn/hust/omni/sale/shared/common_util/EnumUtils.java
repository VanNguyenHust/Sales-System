package vn.hust.omni.sale.shared.common_util;

import java.util.EnumSet;
import java.util.Locale;
import java.util.Objects;

public class EnumUtils {

    /**
     * compare string with lowercase toString value of enum
     *
     * @return enum value if parse success, null if cant parse
     */
    public static <T extends Enum<T>> T parse(String s, Class<T> clazz) {
        return EnumSet.allOf(clazz).stream()
                .filter(e -> Objects.equals(e.toString().toLowerCase(Locale.ROOT), s))
                .findFirst()
                .orElse(null);
    }
}
