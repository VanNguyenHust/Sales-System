package vn.hust.omni.sale.service.metafield.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionValidationStatus;
import vn.hust.omni.sale.shared.common_validator.annotation.StringInList;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "metafield_definitions")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetafieldDefinition {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private int storeId;
    @Size(max = 100)
    private String description;
    @NotNull
    @Size(max = 64)
    @Column(name = "`key`")
    private String key;
    @NotNull
    @Size(max = 320)
    private String name;
    @NotNull
    @Size(max = 255)
    private String namespace;
    @NotNull
    @Size(max = 50)
    @StringInList(array = {"boolean", "date_time", "number_decimal", "single_line_text_field"})
    private String type;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MetafieldDefinitionOwnerType ownerResource;

    private boolean pin;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant modifiedOn;

    @NotNull
    @Enumerated(EnumType.STRING)
    private MetafieldDefinitionValidationStatus validationStatus;

    @OneToMany(mappedBy = "definition", cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter(AccessLevel.NONE)
    @Getter(AccessLevel.NONE)
    @Builder.Default
    private List<MetafieldDefinitionValidation> validations = new ArrayList<>();

    public List<MetafieldDefinitionValidation> getValidations() {
        return List.copyOf(validations);
    }

    public void setValidations(List<ValidationUpdate> validations) {
        if (validations != null) {
            this.validationStatus = MetafieldDefinitionValidationStatus.in_progress;
        }
        this.validations.clear();
        validations.forEach(validation -> this.validations.add(new MetafieldDefinitionValidation(this, validation.name, validation.value)));
    }

    public record ValidationUpdate(String name, String value) {
    }
}
