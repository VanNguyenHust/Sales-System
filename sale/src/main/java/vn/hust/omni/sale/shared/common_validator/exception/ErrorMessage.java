package vn.hust.omni.sale.shared.common_validator.exception;

import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.IOException;
import java.util.*;

@JsonRootName("_")
@JsonSerialize(using = ErrorMessage.ErrorMessageSerializer.class)
public class ErrorMessage {
    private String message;
    private Map<String, List<String>> errors;
    private List<UserError> userErrors;

    private ErrorMessage() {
    }

    public static ErrorMessageBuilder builder() {
        return new ErrorMessageBuilder();
    }

    static class ErrorMessageSerializer extends JsonSerializer<ErrorMessage> {
        @Override
        public void serialize(ErrorMessage value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            if (value.message != null) {
                gen.writeStartObject();
                gen.writeFieldName("error");
                gen.writeString(value.message);
                gen.writeEndObject();
                return;
            }
            var config = serializers.getConfig();
            gen.writeStartObject();
            gen.writeFieldName("errors");
            var namingStrategy = config.getPropertyNamingStrategy();
            if (value.errors != null) {
                gen.writeStartObject();
                for (var error : value.errors.entrySet()) {
                    var name = namingStrategy != null
                            ? namingStrategy.nameForField(null, null, error.getKey())
                            : error.getKey();
                    gen.writeFieldName(name);
                    gen.writeStartArray();
                    for (var mes : error.getValue()) {
                        gen.writeString(mes);
                    }
                    gen.writeEndArray();
                }
                gen.writeEndObject();
            } else {
                gen.writeStartArray();
                for (var error : value.userErrors) {
                    gen.writeStartObject();
                    var code = namingStrategy != null
                            ? namingStrategy.nameForField(null, null, error.getCode())
                            : error.getCode();
                    gen.writeStringField("message", error.getMessage());
                    gen.writeStringField("code", code);
                    if (!error.getFields().isEmpty()) {
                        gen.writeFieldName("fields");
                        gen.writeStartArray();
                        for (var field : error.getFields()) {
                            var fieldName = namingStrategy != null
                                    ? namingStrategy.nameForField(null, null, field)
                                    : field;
                            gen.writeString(fieldName);
                        }
                        gen.writeEndArray();
                    }
                    gen.writeEndObject();
                }
                gen.writeEndArray();
            }
            gen.writeEndObject();
        }
    }

    public static class ErrorMessageBuilder {
        private Map<String, List<String>> errors;
        private List<UserError> userErrors;
        private String message;

        public ErrorMessageBuilder setMessage(String message) {
            this.message = message;
            return this;
        }

        public ErrorMessageBuilder addError(String key, String message) {
            if (errors == null) {
                errors = new HashMap<>();
            }
            errors.putIfAbsent(key, new ArrayList<>());
            errors.get(key).add(message);
            return this;
        }

        public ErrorMessageBuilder addError(UserError userError) {
            if (userErrors == null) {
                userErrors = new ArrayList<>();
            }
            userErrors.add(userError);
            return this;
        }

        public ErrorMessageBuilder addErrors(List<UserError> userErrors) {
            if (this.userErrors == null) {
                this.userErrors = new ArrayList<>();
            }
            this.userErrors.addAll(userErrors);
            return this;
        }

        public ErrorMessageBuilder setError(String key, List<String> messages) {
            if (errors == null) {
                errors = new HashMap<>();
            }
            errors.putIfAbsent(key, messages);
            return this;
        }

        public boolean hasErrors() {
            return this.message != null
                    || (errors != null && !errors.isEmpty())
                    || (userErrors != null && !userErrors.isEmpty());
        }

        public ErrorMessage build() {
            var err = new ErrorMessage();
            err.message = message;
            err.errors = errors;
            err.userErrors = userErrors;
            return err;
        }
    }

    public String getMessage() {
        return message;
    }

    public Map<String, List<String>> getErrors() {
        return Collections.unmodifiableMap(errors);
    }

    public List<UserError> getUserErrors() {
        return Collections.unmodifiableList(userErrors != null ? userErrors : new ArrayList<>());
    }

    @Override
    public String toString() {
        return "ErrorMessage{" +
                "message='" + message + '\'' +
                ", errors=" + errors +
                ", userErrors=" + userErrors +
                '}';
    }
}
