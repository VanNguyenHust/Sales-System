package vn.hust.omni.sale.shared.common_util;

import java.math.BigDecimal;

public class NumberUtils {

    public static boolean isPositive(Integer number) {
        return number != null && number > 0;
    }

    public static boolean isPositive(Long number) {
        return number != null && number > 0;
    }

    public static boolean isPositive(BigDecimal value) {
        return value != null && value.compareTo(BigDecimal.ZERO) > 0;
    }

    public static boolean isPositive(Double value) {
        return value != null && value > 0;
    }

    public static int compare(BigDecimal one, BigDecimal other) {
        if (one == null && other == null)
            return 0;
        if (one == null)
            return -1;
        else if (other == null)
            return 1;
        return one.compareTo(other);
    }

    public static boolean equals(BigDecimal one, BigDecimal other) {
        return ((one == null && other == null) || (one != null && other != null && one.compareTo(other) == 0));
    }
}
