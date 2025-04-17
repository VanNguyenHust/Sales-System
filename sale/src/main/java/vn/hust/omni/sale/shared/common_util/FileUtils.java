package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class FileUtils {
    private static final String BASE64_PDF_PREFIX= "JVBERi0";
    private static final String BASE64_GIFT1_PREFIX= "R0lGODdh";
    private static final String BASE64_GIFT2_PREFIX= "R0lGODlh";
    private static final String BASE64_PNG_PREFIX = "iVBORw0KGgo";
    private static final String BASE64_JPG_PREFIX = "/9j/";

    public static String getContentType(String fileName) {

        if (StringUtils.isEmpty(fileName))
            return StringUtils.EMPTY;

        String extension = FilenameUtils.getExtension(fileName);
        return switch (extension.toLowerCase()) {
            case "bwt" -> "text/x-bwt";
            case "html" -> "text/html";
            case "css", "scss" -> "text/css";
            case "js" -> "application/javascript";
            case "json" -> "application/json";
            case "gif" -> "image/gif";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "ico" -> "image/x-icon";
            case "svg", "svgz" -> "image/svg+xml";
            case "eot" -> "application/vnd.ms-fontobject";
            case "otf" -> "application/x-font-opentype";
            case "ttf" -> "application/x-font-truetype";
            case "woff" -> "application/font-woff";
            case "woff2" -> "application/font-woff2";
            case "zip" -> "application/zip";
            case "swf" -> "application/x-shockwave-flash";
            case "webp" -> "image/webp";
            case "xls" -> "application/vnd.ms-excel";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "xml" -> "application/xml; charset=utf-8";
            case "csv" -> "text/csv";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "pdf" -> "application/pdf";
            case "txt" -> "text/plain";
            default -> StringUtils.EMPTY;
        };
    }

    public static String getExtensionFromContentType(String contentType) {
        if (StringUtils.isEmpty(contentType))
            return StringUtils.EMPTY;

        return switch (contentType.toLowerCase()) {
            case "text/x-bwt" -> "bwt";
            case "text/html" -> "html";
            case "text/css" -> "css";
            case "application/javascript" -> "js";
            case "application/json" -> "json";
            case "image/gif" -> "gif";
            case "image/jpeg", "image/pjpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/x-icon" -> "ico";
            case "image/svg+xml" -> "svg";
            case "application/vnd.ms-fontobject" -> "eot";
            case "application/x-font-opentype" -> "otf";
            case "application/x-font-truetype" -> "ttf";
            case "application/font-woff" -> "woff";
            case "application/x-shockwave-flash" -> "swf";
            case "image/webp" -> "webp";
            case "application/vnd.ms-excel" -> "xls";
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" -> "xlsx";
            case "text/csv" -> "csv";
            case "application/msword" -> "doc";
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> "docx";
            case "application/pdf" -> "pdf";
            case "text/plain" -> "txt";
            default -> StringUtils.EMPTY;
        };
    }

    public static String getExtensionFromFileName(String fileName) {
        var contentType = getContentType(fileName);
        return getExtensionFromContentType(contentType);
    }

    public static String getContentTypeFromBase64(String base64) {
        if (base64.startsWith(BASE64_PDF_PREFIX)) {
            return "application/pdf";
        }

        if (base64.startsWith(BASE64_GIFT1_PREFIX) || base64.startsWith(BASE64_GIFT2_PREFIX)) {
            return "image/gif";
        }

        if (base64.startsWith(BASE64_PNG_PREFIX)) {
            return "image/png";
        }

        if (base64.startsWith(BASE64_JPG_PREFIX)) {
            return "image/jpg";
        }

        return StringUtils.EMPTY;
    }
}
