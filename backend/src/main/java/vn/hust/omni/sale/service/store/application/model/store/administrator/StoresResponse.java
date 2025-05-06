package vn.hust.omni.sale.service.store.application.model.store.administrator;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StoresResponse {
    private List<StoreResponse> stores;
    private long count;
}
