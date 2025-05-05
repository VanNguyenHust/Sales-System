package vn.hust.omni.sale.shared.common_util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class JdbcUtils {

    public static Timestamp bindParam(Instant param) {
        if (param == null) return null;
        return Timestamp.from(param);
    }

}
