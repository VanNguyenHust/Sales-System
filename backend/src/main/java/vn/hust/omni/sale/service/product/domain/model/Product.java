package vn.hust.omni.sale.service.product.domain.model;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.UpdateTimestamp;
import vn.hust.omni.sale.shared.common_util.TextUtils;

import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "Products")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int storeId;

    @NotBlank
    @Size(max = 320)
    private String name;

    @NotBlank
    @Size(max = 150)
    private String alias;

    private String content;

    private String summary;

    private String unit;

    private Boolean isPublished;

    private Instant publishedOn;

    @CreationTimestamp
    private Instant createdOn;
    @UpdateTimestamp
    private Instant modifiedOn;

    @JsonUnwrapped
    @Embedded
    private ProductPricingInfo pricingInfo = new ProductPricingInfo();

    @Valid
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductImage> images = new ArrayList<>();

    @Setter
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = {
            @JoinColumn(name = "product_id", referencedColumnName = "id"),
    })
    private Set<ProductTag> tags = new HashSet<>();

    public void setName(String name) {
        if (StringUtils.equals(this.name, name)) return;
        this.name = name;
        this.alias = TextUtils.toAlias(name);
    }

    public void setContent(String contentStr) {
        if (contentStr == null) return;
        this.content = contentStr;
    }

    public void setSummary(String summaryStr) {
        if (summaryStr == null) return;
        this.summary = summaryStr;
    }

    public void setUnit(String unitStr) {
        if (unitStr == null) return;
        this.unit = unitStr;
    }
}
