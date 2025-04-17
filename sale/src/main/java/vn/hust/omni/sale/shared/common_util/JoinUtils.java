package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class JoinUtils {

    public static <T> String join(List<T> list) {
        return join(list, ",");
    }

    public static <T> String join(List<T> list, String delimiter) {
        if (list == null || list.isEmpty()) return StringUtils.EMPTY;
        if (delimiter == null) delimiter = ",";
        return list.stream().filter(Objects::nonNull).map(T::toString).collect(Collectors.joining(delimiter));
    }

    public static String joinStrings(List<String> stringList) {
        return joinStrings(stringList, ",");
    }

    public static String joinStrings(List<String> stringList, String delimiter) {
        if (stringList == null || stringList.isEmpty()) return StringUtils.EMPTY;
        if (delimiter == null) delimiter = ",";
        return stringList.stream().filter(StringUtils::isNotBlank).map(String::trim).collect(Collectors.joining(delimiter));
    }
}
