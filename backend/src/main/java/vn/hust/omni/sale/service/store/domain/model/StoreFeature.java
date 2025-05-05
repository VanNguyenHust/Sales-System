package vn.hust.omni.sale.service.store.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "StoreFeatures")
@DynamicUpdate
public class StoreFeature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long storeId;

    @Size(max = 255)
    private String featureKey;

    private boolean enable;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant modifiedOn;
}
