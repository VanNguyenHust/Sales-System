package vn.hust.omni.sale.lib.address;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Lazy loading without double locking <p>
 * 1. <a href="https://stackoverflow.com/questions/21604243/correct-implementation-of-initialization-on-demand-holder-idiom">initialization-on-demand holder</a><p>
 * 2. guava CacheLoader <p>
 * 3. guava Supplier
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class AddressUtils {

    public static final String VN_COUNTRY_CODE = "VN";
    public static final int VN_COUNTRY_ID = 201;

    private static final ObjectMapper mapper;

    static {
        mapper = JsonMapper.builder()
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                .build();
    }

    private static <T> T readFile(String file, Class<T> klass) {
        var loader = AddressUtils.class.getClassLoader();
        try (var is = loader.getResourceAsStream(file)) {
            return mapper.readValue(is, klass);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("err while read file: " + file, e);
        } catch (IOException e) {
            throw new IllegalStateException("cant read file: " + file, e);
        }
    }

    private static final class CountriesHolder {
        private static final List<Country> countries = List.of(readFile("country.json", Country[].class));
    }

    public static List<Country> countryList() {
        return CountriesHolder.countries;
    }

    public static Country countryById(int id) {
        return countryList().stream()
                .filter(c -> c.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public static Country countryByCode(String code) {
        return countryList().stream()
                .filter(c -> c.getCode().equals(code))
                .findFirst()
                .orElse(null);
    }

    public static Country countryByName(String name) {
        return countryList().stream()
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public static Country countryVN() {
        return countryList().stream()
                .filter(c -> c.getCode().equals(VN_COUNTRY_CODE))
                .findFirst()
                .orElseThrow();
    }

    private static final class ProvincesHolder {
        private static final List<Province> provinces = List.of(readFile("province.json", Province[].class));
    }

    public static List<Province> provinceList() {
        return ProvincesHolder.provinces;
    }

    public static Province provinceByCode(String code) {
        return provinceList().stream()
                .filter(province -> province.getCode().equals(code))
                .findFirst()
                .orElse(null);
    }

    public static Province provinceByName(String name) {
        return provinceList().stream()
                .filter(province -> province.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    private static final class DistrictsHolder {
        private static final List<District> districts = List.of(readFile("district.json", District[].class));
    }

    public static List<District> districtList() {
        return DistrictsHolder.districts;
    }

    public static List<District> districtsByProvince(Province province) {
        return districtList().stream().filter(district -> district.getProvinceId() == province.getId())
                .collect(Collectors.toList());
    }

    public static District districtByName(Province province, String name) {
        return districtList().stream()
                .filter(district -> district.getProvinceId() == province.getId()
                        && district.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public static District districtByCode(Province province, String code) {
        return districtList().stream()
                .filter(district -> district.getProvinceId() == province.getId()
                        && district.getCode().equals(code))
                .findFirst()
                .orElse(null);
    }

    public static District districtByCode(String code) {
        return districtList().stream()
                .filter(district -> district.getCode().equals(code))
                .findFirst()
                .orElse(null);
    }

    private static final class WardsHolder {
        private static final List<Ward> wards = List.of(readFile("ward.json", Ward[].class));
    }

    public static List<Ward> wardList() {
        return WardsHolder.wards;
    }

    public static List<Ward> wardsByDistrict(District district) {
        return wardList().stream().filter(ward -> ward.getDistrictId() == district.getId())
                .collect(Collectors.toList());
    }

    public static List<Ward> wardsByProvince(Province province) {
        return wardList().stream().filter(ward -> ward.getProvinceId() == province.getId())
                .collect(Collectors.toList());
    }

    public static Ward wardByName(District district, String name) {
        return wardList().stream()
                .filter(ward -> ward.getProvinceId() == district.getProvinceId()
                        && ward.getDistrictId() == district.getId()
                        && ward.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public static Ward wardByCode(District district, String code) {
        return wardList().stream()
                .filter(ward -> ward.getProvinceId() == district.getProvinceId()
                        && ward.getDistrictId() == district.getId()
                        && ward.getCode().equals(code))
                .findFirst()
                .orElse(null);
    }

    public static Ward wardByCode(String code) {
        return wardList().stream()
                .filter(ward -> ward.getCode().equals(code))
                .findFirst()
                .orElse(null);
    }
}
