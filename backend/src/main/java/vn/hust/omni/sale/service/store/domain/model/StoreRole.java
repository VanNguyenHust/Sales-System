package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Length;
import vn.hust.omni.sale.service.store.infrastructure.persistence.StringListJoinAttributeConverter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "StoreRoles")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StoreRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long storeId;

    @NotNull
    @NotBlank
    @Length(max = 100)
    private String name;

    @Convert(converter = StringListJoinAttributeConverter.class)
    private List<String> permissions;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant modifiedOn;

    @Length(max = 255)
    private String note;

    public StoreRole(long storeId, String name, List<String> permissions, String note) {
        this.storeId = storeId;
        this.name = name;
        this.permissions = permissions;
        this.note = note;
    }
}
