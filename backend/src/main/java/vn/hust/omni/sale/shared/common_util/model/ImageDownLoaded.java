package vn.hust.omni.sale.shared.common_util.model;

import com.google.common.net.MediaType;
import lombok.Data;

import java.util.List;

@Data
public class ImageDownLoaded {

    private byte[] bytes;
    private String contentType;
    private static final List<MediaType> supportedContentTypes =  List.of(
            MediaType.parse("image/gif"),
            MediaType.parse("image/jpeg"),
            MediaType.parse("image/jpg"),
            MediaType.parse("image/png"),
            MediaType.parse("image/webp"),
            MediaType.parse("image/x-icon"),
            MediaType.parse("image/svg+xml"));

    public static boolean isSupportedContentType(String contentType) {
        try {
            var mediaType = MediaType.parse(contentType);
            return supportedContentTypes.stream()
                    .anyMatch(mediaType::is);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
