package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Locations")
@DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    private boolean deleted;
    private boolean inventoryManagement;
    @Enumerated(EnumType.STRING)
    private Status status;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant modifiedOn;

    public Location(int id, int storeId, String code) {
        this.id = id;
        this.code = code;
        this.storeId = storeId;
    }

    public enum Status {
        active, expired
    }
}
