package vn.hust.omni.sale.service.customer.application.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonRootName("address")
public class CustomerAddressDto {
    private int id;
    private String address1;
    private String address2;
    private String city;
    private String company;
    private String country;
    private String countryCode;
    private String province;
    private String provinceCode;
    private String district;
    private String districtCode;
    private String ward;
    private String wardCode;
    private String firstName;
    private String lastName;
    private String phone;
    private String zip;
    @JsonProperty("default")
    private boolean isDefault;
}
