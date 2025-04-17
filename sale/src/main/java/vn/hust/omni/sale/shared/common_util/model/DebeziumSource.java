package vn.hust.omni.sale.shared.common_util.model;

import lombok.*;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DebeziumSource {
    private String version;
    private String connector;
    private String name;
    private Instant tsMs;
    private String snapshot;
    private String db;
    private String schema;
    private String table;
}
