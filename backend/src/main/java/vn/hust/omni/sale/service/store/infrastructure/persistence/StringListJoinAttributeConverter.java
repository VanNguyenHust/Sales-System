package vn.hust.omni.sale.service.store.infrastructure.persistence;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;
import vn.hust.omni.sale.shared.common_util.JoinUtils;
import vn.hust.omni.sale.shared.common_util.SplitUtils;

import java.util.List;

@Converter
public class StringListJoinAttributeConverter implements AttributeConverter<List<String>, String> {

    @Override
    @SneakyThrows
    public String convertToDatabaseColumn(List<String> attribute) {
        if (CollectionUtils.isEmpty(attribute)) return null;
        return JoinUtils.joinStrings(attribute);
    }

    @Override
    @SneakyThrows
    public List<String> convertToEntityAttribute(String dbData) {
        if (StringUtils.isNotBlank(dbData) && !dbData.equals(",")) {
            var stringList = SplitUtils.splitToList(dbData);
            if (!stringList.isEmpty()) return stringList;
        }
        return null;
    }
}
