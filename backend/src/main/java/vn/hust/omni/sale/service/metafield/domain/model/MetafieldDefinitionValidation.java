package vn.hust.omni.sale.service.metafield.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.hust.omni.sale.shared.common_validator.annotation.MaxSize;

import java.time.Instant;

@Getter
@Entity
@Table(name = "MetafieldDefinitionValidations")
@NoArgsConstructor
public class MetafieldDefinitionValidation {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private int storeId;
    @NotNull
    @Size(max = 50)
    private String name;
    @NotNull
    @MaxSize(bytes = 65536)
    private String value;
    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant modifiedOn;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "definitionId")
    private MetafieldDefinition definition;

    public MetafieldDefinitionValidation(MetafieldDefinition definition, String name, String value) {
        this.name = name;
        this.value = value;
        this.definition = definition;
        this.storeId = definition.getStoreId();
    }
}
