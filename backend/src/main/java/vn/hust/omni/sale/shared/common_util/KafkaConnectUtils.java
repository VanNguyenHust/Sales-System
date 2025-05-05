package vn.hust.omni.sale.shared.common_util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.base.CaseFormat;
import com.google.common.base.Suppliers;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.kafka.connect.data.Struct;
import org.apache.kafka.connect.json.JsonConverter;
import vn.hust.omni.sale.shared.common_util.model.DebeziumEnvelope;
import vn.hust.omni.sale.shared.common_util.model.DebeziumSource;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.sql.Time;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.function.Supplier;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class KafkaConnectUtils {

    //region Public methods
    public static <T> T unmarshalPOJO(String stringJsonConnectData, Class<T> clazz) throws JsonProcessingException {
        var schemaAndValue = jsonConverterSupplier.get()
                .toConnectData(null, stringJsonConnectData.getBytes(StandardCharsets.UTF_8));
        return unmarshal((Struct) schemaAndValue.value(), clazz);
    }

    /**
     * lưu ý: nếu property bắt đầu bằng is thì phải có annotation @JsonProperty("is_property")
     */
    public static <T> DebeziumEnvelope<T> unmarshalDebeziumEnvelope(String stringJsonConnectData, Class<T> clazz) throws JsonProcessingException {
        var schemaAndValue = jsonConverterSupplier.get()
                .toConnectData(null, stringJsonConnectData.getBytes(StandardCharsets.UTF_8));

        var typeFactory = objectMapperSupplier.get().getTypeFactory();
        var envelopeType = typeFactory.constructParametricType(DebeziumEnvelope.class, clazz);
        return unmarshal((Struct) schemaAndValue.value(), envelopeType);
    }

    public static DebeziumSource unmarshalDebeziumSource(String stringJsonConnectData) throws JsonProcessingException {
        var schemaAndValue = jsonConverterSupplier.get()
                .toConnectData(null, stringJsonConnectData.getBytes(StandardCharsets.UTF_8));
        return unmarshal((Struct) schemaAndValue.value(), DebeziumSourceRoot.class).source;
    }


    public static <T> T getLatestDataFromEnvelope(DebeziumEnvelope<T> envelope) {
        var op = envelope.getOp();
        if (StringUtils.equals(op, DebeziumEnvelope.OPERATOR_CREATE) || StringUtils.equals(op, DebeziumEnvelope.OPERATOR_UPDATE)) {
            return envelope.getAfter();
        } else if (StringUtils.equals(op, DebeziumEnvelope.OPERATOR_DELETE)) {
            return envelope.getBefore();
        }

        return null;
    }

    //endregion

    //region Private methods
    private static <T> T unmarshal(Struct struct, Class<T> clazz) throws SecurityException,
            IllegalArgumentException, JsonProcessingException {
        ObjectNode rootNode = getJsonNodes(struct);
        return objectMapperSupplier.get().treeToValue(rootNode, clazz);
    }

    private static <T> T unmarshal(Struct struct, JavaType javaType) throws JsonProcessingException {
        ObjectNode rootNode = getJsonNodes(struct);
        return objectMapperSupplier.get().treeToValue(rootNode, javaType);
    }

    private static final Supplier<JsonConverter> jsonConverterSupplier = Suppliers.memoize(() -> {
        var jsonConverter = new JsonConverter();
        var configs = new HashMap<String, Object>();
        configs.put("schemas.enable", "true");
        jsonConverter.configure(configs, false);
        return jsonConverter;
    });

    private static final Supplier<ObjectMapper> objectMapperSupplier = Suppliers.memoize(() -> {
        var javaTimeModule = new JavaTimeModule()
                .addDeserializer(Instant.class, new InstantEpochSerializer());
        var timeModule = new SimpleModule()
                .addDeserializer(Time.class, new TimeEpochSerializer());
        return JsonMapper.builder()
                .propertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
                .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
                .addModule(javaTimeModule)
                .addModule(timeModule)
                .build();
    });

    private static String toSnakeCase(String input) {
        return input == null ? null : CaseFormat.UPPER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, input);
    }

    private static ObjectNode getJsonNodes(Struct struct) {
        ObjectNode rootNode = objectMapperSupplier.get().createObjectNode();
        struct.schema().fields().forEach(field -> {
            var data = struct.get(field);
            if (data instanceof Struct) {
                rootNode.putIfAbsent(toSnakeCase(field.name()), getJsonNodes((Struct) data));
            } else if (data instanceof String) {
                rootNode.put(toSnakeCase(field.name()), (String) struct.get(field));
            } else if (data instanceof Long) {
                rootNode.put(toSnakeCase(field.name()), (Long) struct.get(field));
            } else if (data instanceof Float) {
                rootNode.put(toSnakeCase(field.name()), (Float) struct.get(field));
            } else if (data instanceof Short) {
                rootNode.put(toSnakeCase(field.name()), (Short) struct.get(field));
            } else if (data instanceof BigDecimal) {
                rootNode.put(toSnakeCase(field.name()), (BigDecimal) struct.get(field));
            } else if (data instanceof BigInteger) {
                rootNode.put(toSnakeCase(field.name()), (BigInteger) struct.get(field));
            } else if (data instanceof Double) {
                rootNode.put(toSnakeCase(field.name()), (Double) struct.get(field));
            } else if (data instanceof Boolean) {
                rootNode.put(toSnakeCase(field.name()), (Boolean) struct.get(field));
            } else if (data instanceof Integer) {
                rootNode.put(toSnakeCase(field.name()), (Integer) struct.get(field));
            } else if (data instanceof byte[]) {
                rootNode.put(toSnakeCase(field.name()), (byte[]) struct.get(field));
            }
        });
        return rootNode;
    }

    private static class InstantEpochSerializer extends JsonDeserializer<Instant> {
        @Override
        public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            var valueAsString = p.getValueAsString();
            if (NumberUtils.isCreatable(valueAsString)) {
                return Instant.EPOCH.plus(micros(p.getValueAsLong()), ChronoUnit.MICROS);
            } else {
                return Instant.parse(valueAsString);
            }
        }

        private long micros(long timestamp) {
            if (timestamp >= 1E16 || timestamp <= -1E16) {
                return timestamp / 1_000;
            }
            if (timestamp >= 1E14 || timestamp <= -1E14) {
                return timestamp;
            }
            if (timestamp >= 1E11 || timestamp <= -3E10) {
                return timestamp * 1_000;
            }
            return timestamp * 1_000_000;
        }
    }

    private static class TimeEpochSerializer extends JsonDeserializer<Time> {
        private static final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm:ss");
        private static final DateTimeFormatter fmt1 = DateTimeFormatter.ofPattern("HH:mm");
        private static final DateTimeFormatter fmt2 = DateTimeFormatter.ofPattern("hh:mm:ss a");
        private static final DateTimeFormatter fmt3 = DateTimeFormatter.ofPattern("hh:mm a");
        private static final ZoneOffset VN_ZONE_OFFSET = ZoneOffset.of("+07:00");

        @Override
        public Time deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            return parse(p.getValueAsString());
        }

        private static Time parse(String str) {
            if (str == null) {
                return null;
            }
            try {
                return new Time(Long.parseLong(str));
            } catch (NumberFormatException ignore) {
            }
            LocalTime localTime = null;
            try {
                localTime = fmt.parse(str, LocalTime::from);
            } catch (Exception ignore) {
            }
            if (localTime == null) {
                try {
                    localTime = fmt1.parse(str, LocalTime::from);
                } catch (Exception ignore) {
                }
            }
            if (localTime == null) {
                try {
                    localTime = fmt2.parse(str, LocalTime::from);
                } catch (Exception ignore) {
                }
            }
            if (localTime == null) {
                try {
                    localTime = fmt3.parse(str, LocalTime::from);
                } catch (Exception ignore) {
                }
            }
            if (localTime != null) {
                return new Time(localTime.toEpochSecond(LocalDate.now(), VN_ZONE_OFFSET) * 1000L);
            }
            throw new IllegalArgumentException("invalid datetime string");
        }
    }
    //endregion


    @NoArgsConstructor
    @Setter
    static class DebeziumSourceRoot {
        private DebeziumSource source;
    }

}
