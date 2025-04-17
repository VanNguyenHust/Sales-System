package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Locations")
@DynamicUpdate
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
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

    private Instant startDate;
    private Instant endDate;
    private Instant createdOn;
    private Instant modifiedOn;
}
