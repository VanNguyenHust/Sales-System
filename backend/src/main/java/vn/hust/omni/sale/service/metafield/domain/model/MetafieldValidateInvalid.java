package vn.hust.omni.sale.service.metafield.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "MetafieldValidateInvalids")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetafieldValidateInvalid {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private int storeId;
    private int metafieldId;
    private int definitionId;
    private String errorMessage;
    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant modifiedOn;
}
