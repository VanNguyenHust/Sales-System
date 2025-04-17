package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public final class DateUtils {

    public static final DateTimeFormatter LOCALE_DATE_TIME_SECONDS_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static final DateTimeFormatter LOCALE_DATE_TIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public static final DateTimeFormatter LOCAL_DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static final DateTimeFormatter RFC3339_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssxxx");

    public static final DateTimeFormatter RFC3339_FMT_Z = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX");

    public static final ZoneId UTC = ZoneId.of("UTC");

    /**
     * formalize date parsing behavior at sapo omni that support multiple date format
     * <ul>
     *     <li>first try iso format e.g: 2007-12-03T10:15:30.00Z</li>
     *     <li>next try some format with local time zone in order: yyyy-MM-dd HH:mm:ss, yyyy-MM-dd HH:mm, yyyy-MM-dd</li>
     *     <li>throw {@link IllegalArgumentException} if cant parse date string</li>
     * </ul>
     */
    public static Date parse(String dStr) throws IllegalArgumentException {
        return Date.from(parseToInstant(dStr));
    }

    public static Instant parseToInstant(String dStr) {
        Instant ist;
        try {
            ist = Instant.parse(dStr);
        } catch (DateTimeParseException e) {
            ist = null;
        }
        if (ist == null) {
            try {
                var localDatetime = LOCALE_DATE_TIME_SECONDS_FMT.parse(dStr, LocalDateTime::from);
                ist = localDatetime.atZone(UTC).toInstant();
            } catch (DateTimeParseException ignore) {
                // ignore
            }
        }
        if (ist == null) {
            try {
                var localDatetime = LOCALE_DATE_TIME_FMT.parse(dStr, LocalDateTime::from);
                ist = localDatetime.atZone(UTC).toInstant();
            } catch (DateTimeParseException ignore) {
                // ignore
            }
        }
        if (ist == null) {
            try {
                var localDate = LOCAL_DATE_FMT.parse(dStr, LocalDate::from);
                ist = localDate.atStartOfDay().atZone(UTC).toInstant();
            } catch (DateTimeParseException ignore) {
                // ignore
            }
        }
        if (ist == null) {
            throw new IllegalArgumentException("invalid datetime string");
        }
        return ist;
    }

    public static Instant tryParseInstant(String dStr) {
        return tryParseInstant(dStr, null);
    }

    public static Instant tryParseInstant(String dStr, Instant defaultValue) {
        try {
            return parseToInstant(dStr);
        } catch (Exception ignore) {
            return defaultValue;
        }
    }

    public static Date tryParse(String dStr) {
        return tryParse(dStr, null);
    }

    public static Date tryParse(String dStr, Date defaultValue) {
        try {
            return parse(dStr);
        } catch (Exception ignore) {
            return defaultValue;
        }
    }

    public static Date utcNow() {
        return Date.from(Instant.now());
    }

    public static Date utcNow(Clock clock) {
        return Date.from(Instant.now(clock));
    }

    public static Date utcFromNow(Duration duration) {
        return Date.from(Instant.now().plus(duration));
    }

    public static Date utcFromNow(Duration duration, Clock clock) {
        return Date.from(Instant.now(clock).plus(duration));
    }

    public static Date fromInstant(Instant instant) {
        if (instant == null) return null;
        return Date.from(instant);
    }

    public static String toLocaleRFC3339String(Date date) {
        return date.toInstant().atZone(UTC).format(RFC3339_FORMAT);
    }

    public static Clock fixedClock(String isoDateTime) {
        return Clock.fixed(Instant.parse(isoDateTime), UTC);
    }

    public static String toString(Date date) {
        if (date == null) {
            return null;
        }
        return date.toInstant().toString();
    }

    public static Duration durationBetween(Date start, Date end) {
        return Duration.between(start.toInstant(), end.toInstant());
    }

    public static int isSameInstant(Instant one, Instant other) {
        if (one == null && other == null)
            return 0;
        if (one == null)
            return -1;
        else if (other == null)
            return 1;
        return one.compareTo(other);
    }

    public static String formatDate(Date date, String format) {
        if (StringUtils.isEmpty(format)) {
            format = "MM/dd/yyyy HH:mm:ss";
        }

        DateFormat df = new SimpleDateFormat(format);
        return df.format(date);
    }
}
