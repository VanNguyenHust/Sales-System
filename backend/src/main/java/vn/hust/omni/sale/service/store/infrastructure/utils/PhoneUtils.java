package vn.hust.omni.sale.service.store.infrastructure.utils;

import java.util.regex.Pattern;

public class PhoneUtils {
    static final Pattern PATTERN = Pattern.compile("^[\\d]{7,15}$", Pattern.CASE_INSENSITIVE);

    public static boolean isValid(String phone) {
        if (phone == null || phone.isBlank()) {
            return false;
        }
        if (phone.startsWith("+"))
            phone = phone.substring(1);

        return PATTERN.matcher(phone).matches();
    }

    public static String standardZero(String phone) {
        if (phone == null)
            return null;
        if (phone.startsWith("+84"))
            phone = "0".concat(phone.substring(3));
        else if (phone.startsWith("84"))
            phone = "0".concat(phone.substring(2));
        return phone;
    }
}
