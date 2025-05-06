package vn.hust.omni.sale.shared.autoconfigure;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Configuration
public class ObjectMapperConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper mapper = builder.createXmlMapper(false).build();

        JavaTimeModule module = new JavaTimeModule();
        module.addSerializer(Instant.class, new CustomInstantSerializer());
        module.addDeserializer(Instant.class, new CustomInstantDeserializer());

        mapper.registerModule(module);
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return mapper;
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
