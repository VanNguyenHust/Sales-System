package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.StopWatch;
import vn.hust.omni.sale.shared.common_util.model.ImageDownLoaded;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
@Slf4j
public final class ImageDownloadUtils {
    public static final int MAX_SIZE_IN_BYTE = 1024 * 1024 * 2;

    public static byte[] getByteFromUrl(String url) {
        if (StringUtils.isEmpty(url)) {
            return null;
        }
        byte[] bytes = null;
        if (url.startsWith("//")) {
            url = "http:" + url;
        }
        if (!url.startsWith("http")) {
            url = "http://" + url;
        }
        if (url.contains("https://")) {
            // Create a new trust manager that trust all certificates
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                }

                public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                }
            }};

            // Activate the new trust manager
            try {
                SSLContext sc = SSLContext.getInstance("SSL");
                sc.init(null, trustAllCerts, new java.security.SecureRandom());
                HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        StopWatch watch = new StopWatch();
        try {
            URL path = new URL(url);
            URLConnection connection = getHttpInputStream(path);
            connection.setConnectTimeout(1000);
            connection.setReadTimeout(10000);
            // Don't want text/html default header
            connection.setRequestProperty("Accept", "image/*");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15");
            InputStream is = null;
            try {
                watch.start();
                is = connection.getInputStream();
                BufferedInputStream bis = new BufferedInputStream(is);

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                while (true) {
                    int r = bis.read(buffer);
                    if (r == -1) break;
                    out.write(buffer, 0, r);
                }
                out.flush();
                watch.stop();
                bytes = out.toByteArray();
            } catch (Exception ignored) {

            } finally {
                if (watch.isStarted()) watch.stop();

                if (watch.getTime(TimeUnit.MILLISECONDS) > 6000) {
                    //Sentry.capture("get data from url " + url + " slow: " + watch.getTotalTimeMillis());
                    log.warn("get data from url " + url + " slow: " + watch.getTime(TimeUnit.MILLISECONDS));
                }

                //log.info(watch.prettyPrint());
                if (is != null) is.close();
            }
        } catch (Exception ignored) {

        }
        return bytes;
    }

    private static URLConnection getHttpInputStream(URL path) throws IOException {
        // HttpURLConnection con = (HttpURLConnection) path.openConnection();
        URLConnection con = path.openConnection();
        con.setRequestProperty("User-Agent", "JVM");
        // setHeaderProperties(con);
        return con;
    }

    public static ImageDownLoaded getImageFromUrl(String url) {
        ImageDownLoaded imageDownLoaded = null;
        if (StringUtils.isEmpty(url)) {
            return null;
        }
        if (url.startsWith("//")) {
            url = "http:" + url;
        }
        if (!url.startsWith("http")) {
            url = "http://" + url;
        }
        if (url.contains("https://")) {
            // Create a new trust manager that trust all certificates
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                @Override
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                @Override
                public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                }

                @Override
                public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                }
            }};

            // Activate the new trust manager
            try {
                SSLContext sc = SSLContext.getInstance("SSL");
                sc.init(null, trustAllCerts, new java.security.SecureRandom());
                HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        StopWatch watch = new StopWatch();
        try {
            URL path = new URL(url);
            URLConnection connection = getHttpInputStream(path);
            connection.setConnectTimeout(1000);
            connection.setReadTimeout(10000);
            // Don't want text/html default header
            connection.setRequestProperty("Accept", "image/*");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15");
            InputStream is = null;
            try {
                watch.start();
                is = connection.getInputStream();
                byte[] buffer = new byte[MAX_SIZE_IN_BYTE];
                var actualLength = IOUtils.read(is, buffer, 0, MAX_SIZE_IN_BYTE);
                watch.stop();
                if (is.read() != -1) {
                    log.warn("File too big: " + url);
                } else if (buffer != null && buffer.length > 0) {
                    // TODO: review this condition
                    String contentType = connection.getContentType();
                    if (ImageDownLoaded.isSupportedContentType(contentType)) {
                        imageDownLoaded = new ImageDownLoaded();
                        imageDownLoaded.setBytes(Arrays.copyOfRange(buffer, 0, actualLength));
                        imageDownLoaded.setContentType(contentType);
                    }
                }
            } catch (Exception ex) {
                log.trace("err while down image from src={}", url, ex);
            } finally {
                if (watch.isStarted()) watch.stop();

                if (watch.getTime(TimeUnit.MILLISECONDS) > 6000) {
                    log.warn("get data from url " + url + " slow: " + watch.getTime(TimeUnit.MILLISECONDS));
                }

                if (is != null) is.close();
            }
        } catch (Exception ex) {
            log.trace("err while down image from src={}", url, ex);
        }
        return imageDownLoaded;
    }

    public static CompletableFuture<ImageDownLoaded> getImageFromUrlAsync(String url, Executor executor) {
        return CompletableFuture.supplyAsync(() -> getImageFromUrl(url), executor);
    }
}
