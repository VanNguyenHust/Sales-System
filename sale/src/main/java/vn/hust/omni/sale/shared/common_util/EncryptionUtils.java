package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HexFormat;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class EncryptionUtils {

    public static String md5(String md5) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] array = md.digest(md5.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : array) {
                sb.append(Integer.toHexString((b & 0xFF) | 0x100), 1, 3);
            }
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException ignored) {
        }
        return null;
    }

    public static String hmacSha256(String key, String data, HmacFormat format) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            var output = sha256_HMAC.doFinal(data.getBytes("UTF-8"));
            if (HmacFormat.BASE64.equals(format))
                return (Base64.getEncoder().encodeToString(output)).trim();
            return HexFormat.of().formatHex(output);
        } catch (Exception var4) {
            return null;
        }
    }

    public enum HmacFormat {
        BASE64, HEX
    }

}
