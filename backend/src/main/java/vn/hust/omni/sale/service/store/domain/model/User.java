package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;
import vn.hust.omni.sale.shared.common_validator.annotation.StringInList;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Users")
@DynamicUpdate
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Length(max = 128)
    @Email
    private String email;

    @NotBlank
    @Length(max = 64)
    private String password;

    @NotBlank
    @Length(max = 10)
    private String passwordSalt;

    @NotBlank
    @Length(max = 250)
    private String firstName;

    @Length(max = 250)
    private String lastName;

    @Length(max = 20)
    private String phoneNumber;

    @Length(max = 255)
    private String description;

    private boolean accountOwner;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant modifiedOn;

    private int storeId;

    private String confirmCode;

    private Instant confirmCodeExpirationDate;

    @Column(columnDefinition = "TEXT")
    private String permissions;

    @StringInList(array = {"active", "invited", "requested", "collaborator"})
    private String userType;

    private boolean active;
}
