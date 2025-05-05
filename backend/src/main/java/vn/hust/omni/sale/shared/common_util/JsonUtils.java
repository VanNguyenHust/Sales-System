package vn.hust.omni.sale.shared.common_util;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.databind.util.ISO8601DateFormat;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import vn.hust.omni.sale.shared.autoconfigure.JsonNodeWrapper;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

/**
 * Serialize and deserialize json with some default behavior:
 * <ul>
 * <li>snake_case field</li>
 * <li>support enum</li>
 * <li>trim string field when deserialize</li>
 * <li>ignore unknown field</li>
 * <li>serialize {@link java.util.Date} with iso format</li>
 * </ul>
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class JsonUtils {

    private static final ObjectMapper mapper = createObjectMapper();

    private static final ObjectMapper EVENT_MAPPER = createEventMapper();

    public static String marshal(Object obj) throws JsonProcessingException {
        return mapper.writeValueAsString(obj);
    }

    public static String prettyPrint(Object obj) throws JsonProcessingException {
        return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
    }

    public static byte[] marshalToBytes(Object obj) throws JsonProcessingException {
        return mapper.writeValueAsBytes(obj);
    }

    public static <T> T unmarshal(String s, Class<T> clazz) throws JsonProcessingException {
        return mapper.readValue(s, clazz);
    }

    public static <T> T unmarshal(String s, TypeReference<T> type) throws JsonProcessingException {
        return mapper.readValue(s, type);
    }

    public static <T> T unmarshal(String s, JavaType type) throws JsonProcessingException {
        return mapper.readValue(s, type);
    }

    public static <T> JsonNodeWrapper<T> unmarshalJsonNode(String s, Class<T> clazz) throws JsonProcessingException {
        var tree = mapper.readTree(s);
        return new JsonNodeWrapper<>(mapper, tree, mapper.treeToValue(tree, clazz));
    }

    public static <T> T unmarshal(byte[] bytes, Class<T> clazz) throws IOException {
        return mapper.readValue(bytes, clazz);
    }

    public static <T> T unmarshal(byte[] bytes, TypeReference<T> type) throws IOException {
        return mapper.readValue(bytes, type);
    }

    public static <T> T unmarshal(byte[] bytes, JavaType type) throws IOException {
        return mapper.readValue(bytes, type);
    }

    public static <T> T unmarshal(InputStream inputStream, Class<T> clazz) throws IOException {
        return mapper.readValue(inputStream, clazz);
    }

    public static <T> T unmarshal(JsonNode jsonNode, Class<T> clazz) throws JsonProcessingException {
        return mapper.treeToValue(jsonNode, clazz);
    }

    public static <T> JsonNodeWrapper<T> unmarshalJsonNode(byte[] bytes, Class<T> clazz) throws IOException {
        var tree = mapper.readTree(bytes);
        return new JsonNodeWrapper<>(mapper, tree, mapper.treeToValue(tree, clazz));
    }

    public static TypeFactory typeFactory() {
        return mapper.getTypeFactory();
    }

    public static <T> CollectionType constructCollectionType(Class<T> elementClass) {
        return mapper.getTypeFactory().constructCollectionType(List.class, elementClass);
    }

    public static <K, V> MapType constructMapType(Class<K> keyClass, Class<V> valueClass) {
        return mapper.getTypeFactory().constructMapType(Map.class, keyClass, valueClass);
    }

    public static <T> T convertValue(Object fromObject, Class<T> toClassType) {
        return mapper.convertValue(fromObject, toClassType);
    }

    public static <T> T convertValue(Object fromObject, TypeReference<T> toTypeRef) {
        return mapper.convertValue(fromObject, toTypeRef);
    }

    public static <T> T convertValue(Object fromObject, JavaType toJavaType) {
        return mapper.convertValue(fromObject, toJavaType);
    }

    public static <T> T deserialize(String content, Class<T> valueType) {
        try {
            return EVENT_MAPPER.readValue(content, valueType);
        } catch (JacksonException e) {
            throw new IllegalArgumentException("fail to read value into class " + valueType.getName(), e);
        }
    }

    /**
     * handle case thêm event từ order khi xử lý etl
     */
    private static ObjectMapper createEventMapper() {
        return JsonUtils.createObjectMapper()
                .disable(DeserializationFeature.FAIL_ON_INVALID_SUBTYPE);
    }

    /**
     * create {@link ObjectMapper} extend/override default behavior with
     * some new behavior
     */
    @SuppressWarnings("deprecation")
    public static ObjectMapper createObjectMapper() {
        var mapper = new ObjectMapper();
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.enable(JsonGenerator.Feature.WRITE_BIGDECIMAL_AS_PLAIN);
        mapper.enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_USING_DEFAULT_VALUE);
        mapper.setDateFormat(new ISO8601DateFormat());
        mapper.registerModule(new ParameterNamesModule());
        mapper.registerModule(new Jdk8Module());
        mapper.registerModule(new JavaTimeModule());
        var module = new SimpleModule();
        module.addDeserializer(String.class, new StringTrimDeserializer());
        module.addDeserializer(Instant.class, new InstantDeserializer());
        module.addSerializer(Instant.class, new InstantSerializer());
        mapper.registerModule(module);
        return mapper;
    }

    @SuppressWarnings("rawtypes")
    private static class EnumLowercaseSerializer extends StdSerializer<Enum> {
        private EnumLowercaseSerializer() {
            super(Enum.class);
        }

        @Override
        public void serialize(Enum value, JsonGenerator gen, SerializerProvider provider) throws IOException {
            gen.writeString(value.toString().toLowerCase());
        }
    }

    private static class InstantDeserializer extends JsonDeserializer<Instant> {

        @Override
        public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            return DateUtils.tryParseInstant(p.getValueAsString());
        }
    }

    private static class InstantSerializer extends StdSerializer<Instant> {
        private InstantSerializer() {
            super(Instant.class);
        }

        @Override
        public void serialize(Instant value, JsonGenerator gen, SerializerProvider provider) throws IOException {
            gen.writeString(value.truncatedTo(ChronoUnit.SECONDS).toString());
        }
    }

    private static class StringTrimDeserializer extends JsonDeserializer<String> {
        @Override
        public String deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
            return p.getValueAsString().trim();
        }
    }
}
