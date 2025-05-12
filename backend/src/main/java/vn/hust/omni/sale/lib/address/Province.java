package vn.hust.omni.sale.lib.address;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Builder
@Jacksonized
@EqualsAndHashCode
public class Province {
    private int id;
    private String name;
    private String code;
    @JsonProperty("country_id")
    private int countryId;

    @Override
    public String toString() {
        return "Province{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", countryId=" + countryId +
                '}';
    }
}
