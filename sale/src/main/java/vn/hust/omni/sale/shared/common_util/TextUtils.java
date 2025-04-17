package vn.hust.omni.sale.shared.common_util;

import com.google.common.collect.ImmutableMap;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.text.Normalizer;
import java.util.regex.Pattern;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class TextUtils {

    public static final String EMPTY = "";

    private static final String DEFAULT_ALIAS_SPACING = "-";
    private static final String DEFAULT_REPLACE = " ";

    private static final Pattern NON_ASCII_CHAR_OR_NUMBER = Pattern.compile("[^A-Za-z0-9]");
    private static final Pattern REPEATED_HYPHENS = Pattern.compile("-+");
    private static final Pattern REPEATED_SPACES = Pattern.compile("\\s+");

    public static String replaceAll(String input, Pattern regexPattern, String replaceString) {
        return regexPattern.matcher(input).replaceAll(replaceString);
    }

    public static String toAlias(String text, int length) {
        assert text != null;
        var str = removeVietnameseChar(text);
        str = replaceAll(str, NON_ASCII_CHAR_OR_NUMBER, DEFAULT_REPLACE);
        str = replaceAll(str, REPEATED_HYPHENS, DEFAULT_REPLACE);
        str = stripDiacritics(str);
        str = stripNonDiacritics(str);
        str = str.trim();
        str = replaceAll(str, REPEATED_SPACES, DEFAULT_ALIAS_SPACING);

        if (length != 0 && str.length() > length) {
            str = str.substring(0, length);
        }
        return str.toLowerCase();
    }

    public static String toAlias(String text) {
        return toAlias(text, 0);
    }

    private static final Pattern REPLACEABLE_LOWER_CASE_A = Pattern.compile("[àáạảãâầấậẩẫăằắặẳẵ]");
    private static final Pattern REPLACEABLE_LOWER_CASE_E = Pattern.compile("[èéẹẻẽêềếệểễ]");
    private static final Pattern REPLACEABLE_LOWER_CASE_I = Pattern.compile("[ìíịỉĩ]");
    private static final Pattern REPLACEABLE_LOWER_CASE_O = Pattern.compile("[òóọỏõôồốộổỗơờớợởỡ]");
    private static final Pattern REPLACEABLE_LOWER_CASE_U = Pattern.compile("[ùúụủũưừứựửữ]");
    private static final Pattern REPLACEABLE_LOWER_CASE_Y = Pattern.compile("[ỳýỵỷỹ]");
    private static final Pattern REPLACEABLE_LOWER_CASE_D = Pattern.compile("đ");
    private static final Pattern REPLACEABLE_UPPER_CASE_A = Pattern.compile("[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]");
    private static final Pattern REPLACEABLE_UPPER_CASE_E = Pattern.compile("[ÈÉẸẺẼÊỀẾỆỂỄ]");
    private static final Pattern REPLACEABLE_UPPER_CASE_I = Pattern.compile("[ÌÍỊỈĨ]");
    private static final Pattern REPLACEABLE_UPPER_CASE_O = Pattern.compile("[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]");
    private static final Pattern REPLACEABLE_UPPER_CASE_U = Pattern.compile("[ÙÚỤỦŨƯỪỨỰỬỮ]");
    private static final Pattern REPLACEABLE_UPPER_CASE_Y = Pattern.compile("[ỲÝỴỶỸ]");
    private static final Pattern REPLACEABLE_UPPER_CASE_D = Pattern.compile("Đ");

    private static String removeVietnameseChar(String input) {
        input = replaceAll(input, REPLACEABLE_LOWER_CASE_A, "a");
        input = replaceAll(input, REPLACEABLE_LOWER_CASE_E, "e");
        input = replaceAll(input, REPLACEABLE_LOWER_CASE_I, "i");
        input = replaceAll(input, REPLACEABLE_LOWER_CASE_O, "o");
        input = replaceAll(input, REPLACEABLE_LOWER_CASE_U, "u");
        input = replaceAll(input, REPLACEABLE_LOWER_CASE_Y, "y");
        input = replaceAll(input, REPLACEABLE_LOWER_CASE_D, "d");
        input = replaceAll(input, REPLACEABLE_UPPER_CASE_A, "A");
        input = replaceAll(input, REPLACEABLE_UPPER_CASE_E, "E");
        input = replaceAll(input, REPLACEABLE_UPPER_CASE_I, "I");
        input = replaceAll(input, REPLACEABLE_UPPER_CASE_O, "O");
        input = replaceAll(input, REPLACEABLE_UPPER_CASE_U, "U");
        input = replaceAll(input, REPLACEABLE_UPPER_CASE_Y, "Y");
        input = replaceAll(input, REPLACEABLE_UPPER_CASE_D, "D");
        return input;
    }

    private static final Pattern DIACRITICS_AND_FRIENDS = Pattern
            .compile("[\\p{InCombiningDiacriticalMarks}\\p{IsLm}\\p{IsSk}]+");

    public static String stripDiacritics(String str) {
        str = Normalizer.normalize(str, Normalizer.Form.NFD);
        str = DIACRITICS_AND_FRIENDS.matcher(str).replaceAll(EMPTY);
        return str;
    }

    @SuppressWarnings("UnnecessaryUnicodeEscape")
    private static final ImmutableMap<String, String> NON_DIACRITICS = ImmutableMap.<String, String>builder()

            // Remove crap strings with no semantics
            .put(".", DEFAULT_REPLACE).put("\"", DEFAULT_REPLACE).put("'", DEFAULT_REPLACE)

            // Keep relevant characters as separation
            .put("$", DEFAULT_REPLACE).put("%", DEFAULT_REPLACE).put("]", DEFAULT_REPLACE).put("[", DEFAULT_REPLACE)
            .put(")", DEFAULT_REPLACE).put("(", DEFAULT_REPLACE).put("=", DEFAULT_REPLACE).put("!", DEFAULT_REPLACE)
            .put("/", DEFAULT_REPLACE).put("\\", DEFAULT_REPLACE).put("&", DEFAULT_REPLACE).put(",", DEFAULT_REPLACE)
            .put("?", DEFAULT_REPLACE).put("°", DEFAULT_REPLACE)
            // Remove ?? is diacritic?
            .put("|", DEFAULT_REPLACE).put("<", DEFAULT_REPLACE).put(">", DEFAULT_REPLACE).put(";", DEFAULT_REPLACE)
            .put(":", DEFAULT_REPLACE).put("_", DEFAULT_REPLACE).put("#", DEFAULT_REPLACE).put("~", DEFAULT_REPLACE)
            .put("+", DEFAULT_REPLACE).put("*", DEFAULT_REPLACE)

            // Replace non-diacritics as their equivalent characters
            .put("\u0141", "l")
            // BiaLystock
            .put("\u0142", "l")
            // Bialystock
            .put("ß", "ss").put("æ", "ae").put("ø", "o").put("©", "c").put("\u00D0", "d")
            // All Ð ð from http://de.wikipedia.org/wiki/%C3%90
            .put("\u00F0", "d").put("\u0110", "d").put("\u0111", "d").put("\u0189", "d").put("\u0256", "d")
            .put("\u00DE", "th") // thorn
            // Þ
            .put("\u00FE", "th") // thorn þ
            .build();

    private static final char DEFAULT_REPLACE_CHAR = ' ';

    public static String stripNonDiacritics(String orig) {
        StringBuilder ret = new StringBuilder();
        String lastchar = null;
        for (int i = 0; i < orig.length(); i++) {
            String source = orig.substring(i, i + 1);
            String replace = NON_DIACRITICS.get(source);
            String toReplace = replace == null ? source : replace;
            if (DEFAULT_REPLACE.equals(lastchar) && DEFAULT_REPLACE.equals(toReplace)) {
                toReplace = EMPTY;
            } else {
                lastchar = toReplace;
            }
            ret.append(toReplace);
        }
        if (ret.length() > 0 && DEFAULT_REPLACE_CHAR == ret.charAt(ret.length() - 1)) {
            ret.deleteCharAt(ret.length() - 1);
        }
        return ret.toString();
    }

    private static final Pattern COMMON_SPECIAL_CHARS_OR_SYMBOLS = Pattern.compile("[/@#$^&_+=()%!.?*]+");

    // TODO: missing beginning/end constraint - should have been "^[non_character_or_number_or_hyphen]+$"
    public static boolean checkStringContainsOnlySpecialCharactersForAlias(String input) {
        if (input == null) return true;
        return COMMON_SPECIAL_CHARS_OR_SYMBOLS.matcher(input).matches();
    }

    private static final Pattern IN_COMBINING_DIACRITICAL_MARK_CHARACTERS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    // Copy from: org.apache.commons.lang3.StringUtils.stripAccents method
    public static String stripAccents(final String input) {
        if (StringUtils.isBlank(input)) return null;
        final StringBuilder decomposed = new StringBuilder(Normalizer.normalize(input, Normalizer.Form.NFD));
        convertRemainingAccentCharacters(decomposed);
        // NOTE: this doesn't correctly remove ligatures...
        return IN_COMBINING_DIACRITICAL_MARK_CHARACTERS.matcher(decomposed).replaceAll(StringUtils.EMPTY);
    }

    @SuppressWarnings("UnnecessaryUnicodeEscape")
    private static void convertRemainingAccentCharacters(final StringBuilder decomposed) {
        for (int i = 0; i < decomposed.length(); i++) {
            switch (decomposed.charAt(i)) {
                case '\u0110' -> decomposed.setCharAt(i, 'D');
                case '\u0111' -> decomposed.setCharAt(i, 'd');
                case '\u0141' -> decomposed.setCharAt(i, 'L');
                case '\u0142' -> decomposed.setCharAt(i, 'l');
            }
        }
    }

    private static final Pattern ONLY_UNICODE_WORD_CHARACTERS = Pattern.compile("^\\w*$");

    public static boolean withoutSpecialCharacter(String input) {
        if (input == null) return false;
        return ONLY_UNICODE_WORD_CHARACTERS.matcher(input).matches();
    }
}
