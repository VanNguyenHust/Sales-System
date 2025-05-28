package vn.hust.omni.sale.service.metafield.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "metafields")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Metafield {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private int id;
    private int storeId;

    @Column(name = "`key`")
    private String key;
    private String namespace;
    private int ownerId;
    private String ownerResource;
    private String value;
    private String valueType;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant modifiedOn;
}
