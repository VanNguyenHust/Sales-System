package vn.hust.omni.sale.service.store.infrastructure.persistence;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;

@Converter
public class IntegerListJoinAttributeConverter implements AttributeConverter<List<Integer>, String> {

    @Override
    public String convertToDatabaseColumn(List<Integer> attribute) {
        if (attribute == null || attribute.isEmpty())
            return null;
        return StringUtils.join(attribute, ",");
    }

    @Override
    public List<Integer> convertToEntityAttribute(String dbData) {
        if (dbData == null)
            return List.of();
        return Arrays.stream(StringUtils.split(dbData, ","))
                .mapToInt(Integer::parseInt).boxed()
                .toList();
    }
}
