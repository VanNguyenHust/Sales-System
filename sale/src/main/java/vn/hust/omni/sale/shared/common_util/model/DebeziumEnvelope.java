package vn.hust.omni.sale.shared.common_util.model;

import lombok.*;

/**
 * <p>Debezium Envelope</p>
 * <p>op possible values</p>
 * <ul>
 * <li>c = create</li>
 * <li>u = update</li>
 * <li>d = delete</li>
 * <li>r = read (applies to only snapshots)</li>
 * </ul>
 *
 * <p>REF:</p>
 * <li>https://debezium.io/documentation/reference/stable/connectors/sqlserver.html#sqlserver-change-event-values</li>
 * <li>https://debezium.io/documentation/reference/stable/connectors/mysql.html#mysql-change-event-values</li>
 *
 * @param <T>
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DebeziumEnvelope<T> {

    public static final String OPERATOR_CREATE = "c";
    public static final String OPERATOR_UPDATE = "u";
    public static final String OPERATOR_DELETE = "d";
    public static final String OPERATOR_READ = "r";

    private String op;
    private T before;
    private T after;
}
