package vn.hust.omni.sale.service.product.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Embeddable
@EqualsAndHashCode
@Accessors(chain = true)
@AllArgsConstructor
@Getter
@Builder
public class ProductTag implements Serializable {
    @Column(name = "tag_alias")
    private String alias;

    @Column(name = "tag")
    private String name;
}
