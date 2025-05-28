package vn.hust.omni.sale.service.product.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "InventoryLevels")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@Builder
public class InventoryLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(updatable = false)
    private long storeId;

    @Column(updatable = false)
    private int productId;

    @Column(updatable = false)
    private long locationId;

    private BigDecimal quantity;

    private BigDecimal saleAvailable;

    @CreationTimestamp
    private Instant createdOn;

    @UpdateTimestamp
    private Instant updatedOn;
}
