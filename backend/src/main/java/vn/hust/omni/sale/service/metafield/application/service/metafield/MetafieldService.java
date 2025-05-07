package vn.hust.omni.sale.service.metafield.application.service.metafield;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;

public class MetafieldService {

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
