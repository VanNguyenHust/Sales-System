package vn.hust.omni.sale.shared.autoconfigure;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Configuration
public class ObjectMapperConfig {
    @Bean(name = "json_without_root")
    @Primary
    public ObjectMapper jsonWithoutRoot() {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(Instant.class, new CustomInstantSerializer())
                .addDeserializer(Instant.class, new CustomInstantDeserializer());
        return new ObjectMapper()
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .registerModule(javaTimeModule);
    }

    @Bean(name = "json_with_root")
    public ObjectMapper jsonWithRoot() {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(Instant.class, new CustomInstantSerializer())
                .addDeserializer(Instant.class, new CustomInstantDeserializer());
        return new ObjectMapper()
                .configure(SerializationFeature.WRAP_ROOT_VALUE, true)
                .configure(DeserializationFeature.UNWRAP_ROOT_VALUE, true)
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .registerModule(javaTimeModule);
    }

    public static class CustomInstantSerializer extends JsonSerializer<Instant> {
        private static final DateTimeFormatter FORMATTER =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                        .withZone(ZoneId.of("UTC+7"));

        @Override
        public void serialize(Instant value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeString(FORMATTER.format(value));
        }
    }

    public static class CustomInstantDeserializer extends JsonDeserializer<Instant> {
        private static final DateTimeFormatter FORMATTER =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                        .withZone(ZoneOffset.UTC);

        @Override
        public Instant deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String date = p.getText();
            try {
                return Instant.parse(date);
            } catch (Exception e) {
                return LocalDateTime.parse(date, FORMATTER).toInstant(ZoneOffset.UTC);
            }
        }
    }
}
