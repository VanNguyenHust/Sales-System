package vn.hust.omni.sale.service.store.application.model.store.administrator;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Data;
import vn.hust.omni.sale.shared.autoconfigure.ObjectMapperConfig;

import java.time.Instant;

@Data
@Builder
public class StoreResponse {
    private int id;
    private String name;
    private String province;
    private String phoneNumber;
    private String email;
    private int status;
    private String storeOwner;
    private int maxProduct;
    private Integer maxLocation;
    private Integer maxUser;

    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant createdOn;
    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant startDate;
    @JsonSerialize(using = ObjectMapperConfig.CustomInstantSerializer.class)
    private Instant endDate;
}
