package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.shared.bind.ParamName;
import vn.hust.omni.sale.shared.bind.SupportParamName;
import vn.hust.omni.sale.shared.common_model.PagingFilterRequest;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SupportParamName
public class MetafieldDefinitionFilterRequest extends PagingFilterRequest {
    @ParamName("owner_resource")
    @NotNull
    private MetafieldDefinitionOwnerType ownerResource;
    private Boolean pin;
    @ParamName("resource_id")
    private Integer resourceId;
    private String key;
    private String namespace;
    private Boolean reverse;
}
