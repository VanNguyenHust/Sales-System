package vn.hust.omni.sale.shared.common_util;

import java.net.URL;

public class NetworkUtils {
    public static boolean isValidUrl(String url) {
        try {
            new URL(url).toURI();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
