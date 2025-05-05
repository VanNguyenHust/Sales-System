package vn.hust.omni.sale.shared.common_util;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

/**
 * Utility class for generating IDs.
 *
 * @author HieuVV
 */

public class IdUtils {
    /**
     * Generate a random UUID.
     * @return a random UUID without hyphens
     */
    public static String randomUUID() {
        return beautifyUUID(UUID.randomUUID());
    }

    /**
     * Generate a name UUID from a string.
     * @param s the string to generate the UUID from
     * @return a name UUID without hyphens
     */
    public static String nameUUIDFromString(String s) {
        return beautifyUUID(UUID.nameUUIDFromBytes(s.getBytes(StandardCharsets.UTF_8)));
    }

    private static String beautifyUUID(UUID id) {
        return id.toString().replace("-", "");
    }
}
