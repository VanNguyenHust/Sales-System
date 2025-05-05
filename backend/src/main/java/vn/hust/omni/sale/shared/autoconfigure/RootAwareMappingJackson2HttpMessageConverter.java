package vn.hust.omni.sale.shared.autoconfigure;

import com.fasterxml.jackson.core.JsonEncoding;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.cfg.MapperConfig;
import com.fasterxml.jackson.databind.exc.InvalidDefinitionException;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonInputMessage;
import org.springframework.http.converter.json.MappingJacksonValue;
import org.springframework.lang.Nullable;
import org.springframework.util.TypeUtils;

import java.io.IOException;
import java.lang.reflect.Type;

public class RootAwareMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter {
    private static final String NO_ROOT_NAME = "_";
    private final ObjectMapper noRootNameObjectMapper;

    public RootAwareMappingJackson2HttpMessageConverter() {
        this(Jackson2ObjectMapperBuilder.json().build());
    }

    public RootAwareMappingJackson2HttpMessageConverter(ObjectMapper objectMapper) {
        super(objectMapper);
        if (objectMapper.isEnabled(SerializationFeature.WRAP_ROOT_VALUE)) {
            noRootNameObjectMapper = objectMapper.copy().disable(SerializationFeature.WRAP_ROOT_VALUE);
        } else {
            noRootNameObjectMapper = objectMapper;
        }
    }

    @Override
    protected void writeInternal(Object object, @Nullable Type checkerType, HttpOutputMessage outputMessage)
            throws IOException, HttpMessageNotWritableException {
        MediaType contentType = outputMessage.getHeaders().getContentType();
        JsonEncoding encoding = getJsonEncoding(contentType);
        try {
            Object value = object;
            Class<?> serializationView = null;
            FilterProvider filters = null;
            JavaType javaType = null;

            if (object instanceof MappingJacksonValue) {
                MappingJacksonValue container = (MappingJacksonValue) object;
                value = container.getValue();
                serializationView = container.getSerializationView();
                filters = container.getFilters();
            }
            if (checkerType != null && TypeUtils.isAssignable(checkerType, value.getClass())) {
                javaType = getJavaType(checkerType, null);
            }

            var objectMapper = this.defaultObjectMapper;
            var enableRootName = this.defaultObjectMapper.isEnabled(SerializationFeature.WRAP_ROOT_VALUE);
            String rootName = null;
            if (enableRootName) {
                if (javaType != null) {
                    rootName = resolveRootName(javaType, this.defaultObjectMapper.getSerializationConfig());
                } else {
                    rootName = resolveRootName(object.getClass(), this.defaultObjectMapper.getSerializationConfig());
                }
                if (rootName.equals(NO_ROOT_NAME)) {
                    enableRootName = false;
                    rootName = null;
                    objectMapper = this.noRootNameObjectMapper;
                }
            }

            JsonGenerator generator = objectMapper.getFactory().createGenerator(outputMessage.getBody(), encoding);
            ObjectWriter objectWriter = (serializationView != null ?
                    objectMapper.writerWithView(serializationView) : objectMapper.writer());

            if (filters != null) {
                objectWriter = objectWriter.with(filters);
            }
            var isMapLike = false;
            if (javaType != null) {
                if (javaType.isContainerType()) {
                    if (javaType.isMapLikeType()) {
                        isMapLike = true;
                    } else {
                        objectWriter = objectWriter.forType(javaType);
                    }
                } else if (!javaType.getBindings().isEmpty()) {
                    objectWriter = objectWriter.forType(javaType);
                }
            }
            if (enableRootName) {
                if (isMapLike) {
                    objectWriter = objectWriter.withoutRootName();
                } else if (javaType != null) {
                    objectWriter = objectWriter.withRootName(rootName);
                }
            }
            objectWriter.writeValue(generator, value);
            generator.flush();
        } catch (InvalidDefinitionException ex) {
            throw new HttpMessageConversionException("Type definition error: " + ex.getType(), ex);
        } catch (JsonProcessingException ex) {
            throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getOriginalMessage(), ex);
        }
    }

    private String resolveRootName(JavaType javaType, MapperConfig<?> config) {
        String rootName;
        if (javaType.isContainerType()) {
            var simpleName = config.findRootName(javaType.getContentType()).getSimpleName();
            if (simpleName.equals(NO_ROOT_NAME)) {
                return NO_ROOT_NAME;
            }
            rootName = NamingUtils.plural(simpleName);
        } else {
            var simpleName = config.findRootName(javaType).getSimpleName();
            if (simpleName.equals(NO_ROOT_NAME)) {
                return NO_ROOT_NAME;
            }
            rootName = simpleName;
        }
        if (config.getPropertyNamingStrategy() != null) {
            rootName = config.getPropertyNamingStrategy().nameForField(null, null, rootName);
        }
        return rootName;
    }

    private String resolveRootName(Class<?> clazz, MapperConfig<?> config) {
        String rootName;
        var simpleName = config.findRootName(clazz).getSimpleName();
        if (simpleName.equals(NO_ROOT_NAME)) {
            return NO_ROOT_NAME;
        }
        rootName = simpleName;
        if (config.getPropertyNamingStrategy() != null) {
            rootName = config.getPropertyNamingStrategy().nameForField(null, null, rootName);
        }
        return rootName;
    }

    @Override
    protected Object readInternal(Class<?> clazz, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException {
        JavaType javaType = getJavaType(clazz, null);
        return readJavaType(javaType, inputMessage);
    }

    @Override
    public Object read(Type checkerType, @Nullable Class<?> contextClass, HttpInputMessage inputMessage)
            throws IOException, HttpMessageNotReadableException {
        JavaType javaType = getJavaType(checkerType, contextClass);
        return readJavaType(javaType, inputMessage);
    }

    private Object readJavaType(JavaType javaType, HttpInputMessage inputMessage) throws IOException {
        try {
            if (inputMessage instanceof MappingJacksonInputMessage) {
                Class<?> deserializationView = ((MappingJacksonInputMessage) inputMessage).getDeserializationView();
                if (deserializationView != null) {
                    return this.defaultObjectMapper.readerWithView(deserializationView).forType(javaType).
                            readValue(inputMessage.getBody());
                }
            }
            var config = this.defaultObjectMapper.getDeserializationConfig();
            if (!config.isEnabled(DeserializationFeature.UNWRAP_ROOT_VALUE)) {
                if (javaType.isTypeOrSubTypeOf(JsonNodeWrapper.class)) {
                    var entityType = javaType.containedType(0);
                    var jsonNode = this.defaultObjectMapper.readTree(inputMessage.getBody());
                    var entity = this.defaultObjectMapper.readValue(defaultObjectMapper.treeAsTokens(jsonNode), entityType);
                    return new JsonNodeWrapper<>(defaultObjectMapper, jsonNode, entity);
                }
                return this.defaultObjectMapper.readValue(inputMessage.getBody(), javaType);
            } else {
                if (javaType.isTypeOrSubTypeOf(JsonNodeWrapper.class)) {
                    var entityType = javaType.containedType(0);
                    var rootName = resolveRootName(entityType, config);
                    var reader = this.defaultObjectMapper.readerFor(entityType)
                            .withRootName(rootName);
                    var jsonNode = reader.readTree(inputMessage.getBody());
                    var entity = reader.withoutRootName().readValue(reader.treeAsTokens(jsonNode));
                    return new JsonNodeWrapper<>(defaultObjectMapper, jsonNode, entity);
                }
                var rootName = resolveRootName(javaType, config);
                return this.defaultObjectMapper.readerFor(javaType).withRootName(rootName).readValue(inputMessage.getBody());
            }
        } catch (InvalidDefinitionException ex) {
            throw new HttpMessageConversionException("Type definition error: " + ex.getType(), ex);
        } catch (JsonProcessingException ex) {
            throw new HttpMessageNotReadableException("JSON parse error: " + ex.getOriginalMessage(), ex, inputMessage);
        }
    }
}

