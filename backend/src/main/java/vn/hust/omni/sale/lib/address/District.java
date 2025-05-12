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
public class District {
    private int id;
    private String name;
    private String code;
    @JsonProperty("province_id")
    private int provinceId;

    @Override
    public String toString() {
        return "District{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", provinceId=" + provinceId +
                '}';
    }
}
