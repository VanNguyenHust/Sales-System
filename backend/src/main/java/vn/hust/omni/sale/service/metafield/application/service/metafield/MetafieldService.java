package vn.hust.omni.sale.service.metafield.application.service.metafield;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.metafield.domain.repository.JpaMetafieldRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetafieldService {
    private final JpaMetafieldRepository metafieldRepository;

    public void removeByDefinition(int storeId, MetafieldDefinitionOwnerType ownerResource, String namespace, String key) {
        metafieldRepository.deleteByDefinition(storeId, ownerResource.name(), namespace, key);
    }

    public static String dateParseByFormat(String date, boolean fullFormatDateTime) {
        var result = "";
        boolean containsZ = date.contains("Z");

        DateTimeFormatterBuilder formatterBuilder = new DateTimeFormatterBuilder()
                .appendPattern(fullFormatDateTime ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd");

        if (containsZ && fullFormatDateTime) {
            formatterBuilder.appendLiteral('Z');
        }

        DateTimeFormatter formatter = formatterBuilder.toFormatter();

        try {
            if (fullFormatDateTime) {
                LocalDateTime parsedDate = LocalDateTime.parse(date.trim(), formatter);
                result = parsedDate.format(formatter);
            } else {
                LocalDate parsedDate = LocalDate.parse(date.trim(), formatter);
                result = parsedDate.format(formatter);
            }
        } catch (DateTimeParseException pe) {
            return null;
        }
        if (!result.contains(date)) {
            return null;
        }
        return result;
    }
}
