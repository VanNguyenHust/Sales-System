package vn.hust.omni.sale.shared.autoconfigure;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class JsonNodeWrapper<T> {
    private final JsonNode jsonNode;
    private final T obj;
    private final ObjectMapper mapper;

    public JsonNodeWrapper(ObjectMapper mapper, JsonNode jsonNode, T obj) {
        this.jsonNode = jsonNode;
        this.obj = obj;
        this.mapper = mapper;
    }

    public JsonNode jsonNode() {
        return jsonNode;
    }

    public T obj() {
        return obj;
    }

    public T mergeInto(T t) {
        try {
            return mapper.readerForUpdating(t).withoutRootName().readValue(jsonNode);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
