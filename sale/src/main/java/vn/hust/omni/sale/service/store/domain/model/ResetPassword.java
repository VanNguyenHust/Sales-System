package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.validator.constraints.Length;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "ResetPasswords")
@DynamicUpdate
public class ResetPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotBlank
    @Length(max = 25)
    private String type;

    private int accountId;

    @NotBlank
    @Length(max = 255)
    private String token;

    @NotNull
    private Instant createdOn;

    private int storeId;
}