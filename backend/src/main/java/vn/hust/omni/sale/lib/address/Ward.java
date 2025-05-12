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
public class Ward {
    private int id;
    private String name;
    private String code;
    @JsonProperty("district_id")
    private int districtId;
    @JsonProperty("province_id")
    private int provinceId;

    @Override
    public String toString() {
        return "Ward{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", districtId=" + districtId +
                ", provinceId=" + provinceId +
                '}';
    }
}
