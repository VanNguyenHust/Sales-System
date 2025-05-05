package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;

import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ImageUtils {

    /**
     * @return Pair of image width and height
     */
    public static Pair<Integer, Integer> detectImageInfo(byte[] imageData) {
        try {
            var image = ImageIO.read(new ByteArrayInputStream(imageData));
            if (image == null) return null;
            return Pair.of(image.getWidth(), image.getHeight());
        } catch (Exception exception) {
            return null;
        }
    }

    public static boolean isImageExtension(String extension) {
        return switch (extension.toLowerCase()) {
            case "gif", "jpg", "jpeg", "png", "svg", "ico", "webp" -> true;
            default -> false;
        };
    }

}
