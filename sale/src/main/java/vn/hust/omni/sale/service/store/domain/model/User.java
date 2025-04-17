package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;
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
    private String url;

    @Length(max = 255)
    private String description;

    private Instant lastLogin;

    private boolean accountOwner;

    private boolean receivedAnnouncements;

    @NotNull
    private Instant createdOn;
    private Instant modifiedOn;

    private int storeId;

    private String permissions;

    private Instant startSession;

    @StringInList(array = {"regular", "invited", "requested", "collaborator"})
    private String userType;

    private boolean tfaEnabled;

    private String loginIdentity;

    @Transient
    private String userEventMessages;

    private boolean active;
}
