package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Stores")
@DynamicUpdate
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    @Length(max = 150)
    private String alias;

    @NotBlank
    @Length(max = 320)
    private String name;

    @Length(max = 200)
    @NotNull
    private String domain;

    @Length(max = 100)
    private String email;

    @Length(max = 20)
    private String phoneNumber;

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant modifiedOn;

    @Length(max = 255)
    private String address;

    @Length(max = 50)
    private String country;

    @Length(max = 10)
    private String countryCode;

    @Length(max = 50)
    private String province;

    @Length(max = 10)
    private String provinceCode;

    @Length(max = 10)
    private String currency;

    @NotNull
    private int status;

    @NotNull
    private boolean deleted;

    @Length(max = 100)
    private String storeOwner;

    private int maxProduct;

    private Integer maxLocation;

    private Integer maxUser;

    @Override
    public Store clone() {
        try {
            return (Store) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }
}
