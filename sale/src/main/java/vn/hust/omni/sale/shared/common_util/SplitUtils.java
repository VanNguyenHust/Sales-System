package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class SplitUtils {

    public static List<String> splitToList(String delimitedValue) {
        return splitToList(delimitedValue, ",");
    }

    /**
     * Split delimited string into list
     *
     * @param delimitedValue delimited string
     * @param delimiter      separator
     * @return result list
     */
    public static List<String> splitToList(String delimitedValue, String delimiter) {
        if (delimitedValue == null) return new ArrayList<>();
        if (delimiter == null) delimiter = ",";
        return Arrays.stream(delimitedValue.trim().split(delimiter))
                .filter(StringUtils::isNotBlank)
                .map(String::trim)
                .distinct()
                .collect(Collectors.toList());
    }
}
