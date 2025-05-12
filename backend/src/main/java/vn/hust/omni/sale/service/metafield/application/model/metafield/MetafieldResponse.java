package vn.hust.omni.sale.service.metafield.application.model.metafield;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@JsonRootName("metafield")
public class MetafieldResponse implements Serializable {
    private int id;

    private Instant createdOn;

    private String key;

    private String namespace;

    private int ownerId;

    private String ownerResource;

    private String value;

    private String valueType;
}
