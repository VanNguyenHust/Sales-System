package vn.hust.omni.sale.shared.common_util;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Currency;
import java.util.regex.Pattern;

public class CurrencyUtils {
    private static String defaultMoneyFormat = "{{amount}}đ";
    private static String placeholderRegex = "\\{\\{\\s*(\\w+)\\s*\\}\\}";

    /**
     * Định dạng tiền dựa trên cấu hình của shop
     *
     * @param amount - Giá trị tiền. Ví dụ 1000, "10.000"
     * @return value - Giá trị tiền đã được định dạng
     */
    public static String formatMoney(BigDecimal amount) {
        return formatMoney(amount, defaultMoneyFormat);
    }

    /**
     * Định dạng tiền dựa trên cấu hình của shop
     *
     * @param amount - Giá trị tiền. Ví dụ 1000, "10.000"
     * @param format - Cấu hình định dạng tiền tệ của shop. Ví dụ: {{amount_no_decimals_with_comma_separator}}₫
     * @return value - Giá trị tiền đã được định dạng
     */
    public static String formatMoney(BigDecimal amount, String format) {
        String value = "";
        if (format == null)
            format = defaultMoneyFormat;
        var tokens = Pattern.compile(placeholderRegex).matcher(format);
        if (tokens.find()) {
            switch (tokens.group(1)) {
                case "amount" -> value = formatWithDelimiters(amount, 2, ',', '.');
                case "amount_no_decimals" -> value = formatWithDelimiters(amount, 0, ',', '.');
                case "amount_with_comma_separator" -> value = formatWithDelimiters(amount, 2, '.', ',');
                case "amount_no_decimals_with_comma_separator" -> value = formatWithDelimiters(amount, 0, '.', ',');
            }
        }

        return format.replaceAll(placeholderRegex, value);
    }

    public static String formatDisplayMoney(BigDecimal amount, String currencyCode) {
        var currency = Currency.getInstance(currencyCode);
        return formatDisplayMoney(amount, currency);
    }

    public static String formatDisplayMoney(BigDecimal amount, Currency currency) {
        var formattedAmount = formatWithDelimiters(amount, currency.getDefaultFractionDigits(), ',', '.');
        return formattedAmount + " " + currency.getCurrencyCode();
    }

    public static String formatWithDelimiters(BigDecimal number, int precision, char thousands, char decimal) {
        if (number == null) {
            return "0";
        }
        DecimalFormatSymbols otherSymbols = new DecimalFormatSymbols();
        otherSymbols.setDecimalSeparator(decimal);
        otherSymbols.setGroupingSeparator(thousands);
        DecimalFormat df = new DecimalFormat();
        df.setMinimumFractionDigits(precision);
        df.setMaximumFractionDigits(precision);
        df.setDecimalFormatSymbols(otherSymbols);
        return df.format(number);
    }
}
