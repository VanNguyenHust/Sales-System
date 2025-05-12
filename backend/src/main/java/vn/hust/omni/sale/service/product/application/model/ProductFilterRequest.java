package vn.hust.omni.sale.service.product.application.model;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;
import vn.hust.omni.sale.shared.bind.ParamName;
import vn.hust.omni.sale.shared.bind.SupportParamName;
import vn.hust.omni.sale.shared.common_model.PagingFilterRequest;

import java.time.Instant;
import java.util.List;

@SupportParamName
@Getter
@Setter
public class ProductFilterRequest extends PagingFilterRequest {
    @Size(max = 255)
    private String query;
    @ParamName("product_type")
    private String productType;
    private String vendor;
    @ParamName("tag_aliases")
    private List<String> tagAliases;
    private List<String> tags;
    private List<Integer> ids;
    @ParamName("since_id")
    private int sinceId;
    private String alias;
    @ParamName("collection_id")
    private int collectionId;
    @ParamName("created_on_min")
    private Instant createdOnMin;
    @ParamName("created_on_max")
    private Instant createdOnMax;
    @ParamName("modified_on_min")
    private Instant modifiedOnMin;
    @ParamName("modified_on_max")
    private Instant modifiedOnMax;
    @ParamName("published_on_min")
    private Instant publishedOnMin;
    @ParamName("published_on_max")
    private Instant publishedOnMax;
    private Boolean published;
    @ParamName("sort_by")
    private String sortBy;
    private Boolean available;
    private List<String> metafields;
    @ParamName("lot_management")
    private Boolean lotManagement;

    // Context
    @ParamName("context_price_client_id")
    private String contextPriceClientId;
    @ParamName("context_price_location_id")
    private Integer contextPriceLocationId;
    @ParamName("context_price_customer_group_id")
    private Integer contextPriceCustomerGroupId;
    @ParamName("context_publication_customer_group_id")
    private Integer contextPublicationCustomerGroupId;
    @ParamName("context_publication_client_id")
    private String contextPublicationClientId;

    public List<String> getTags() {
        if (this.tags == null) return List.of();
        return this.tags.stream().filter(StringUtils::isNotBlank).toList();
    }

    public List<String> getTagAliases() {
        if (this.tagAliases == null) return List.of();
        return this.tagAliases.stream().filter(StringUtils::isNotBlank).toList();
    }
}
