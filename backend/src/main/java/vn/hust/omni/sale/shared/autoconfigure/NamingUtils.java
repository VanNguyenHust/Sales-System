package vn.hust.omni.sale.shared.autoconfigure;

import java.util.Set;

public class NamingUtils {
    private static final Set<String> ES_ENDING = Set.of("ss", "sh", "ch", "x", "z");
    private static final Set<String> Y_ENDING = Set.of("ay", "ey", "oy", "uy");

    public static String plural(String name) {
        for (var ending : ES_ENDING) {
            if (name.endsWith(ending)) {
                return name + "es";
            }
        }
        if (name.endsWith("y")) {
            for (var ending : Y_ENDING) {
                if (name.endsWith(ending)) {
                    return name + "s";
                }
            }
            return name.substring(0, name.length() - 1) + "ies";
        }
        return name + "s";
    }
}
