package vn.hust.omni.sale.service.store.application.model.location;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;
import vn.hust.omni.sale.shared.autoconfigure.ObjectMapperConfig;

import java.time.Instant;

@Setter
@Getter
public class LocationResponse {
    private int id;
    private int storeId;
    private String code;
    private String name;
    private String email;
    private String phone;
    private boolean defaultLocation;

    private String country;
    private String countryCode;
    private String province;
    private String provinceCode;
    private String district;
    private String districtCode;
    private String ward;
    private String wardCode;
    private String address1;

    private boolean inventoryManagement;

    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant createdOn;
    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant modifiedOn;
}
