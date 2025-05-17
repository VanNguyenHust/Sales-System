package vn.hust.omni.sale.service.store.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.hust.omni.sale.service.store.application.model.store.EnableStoreRequest;
import vn.hust.omni.sale.service.store.application.model.store.RegisterStoreRequest;
import vn.hust.omni.sale.service.store.application.model.store.UpdateStoreRequest;
import vn.hust.omni.sale.service.store.application.model.store.administrator.StoreResponse;
import vn.hust.omni.sale.service.store.application.service.StoreService;
import vn.hust.omni.sale.shared.security.StoreId;

@RestController
@RequestMapping(value = "/admin/store")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @PostMapping("/register")
    public void registerStore(@RequestBody RegisterStoreRequest request) {
        storeService.registerStore(request);
    }

    @PutMapping("/enable")
    public void enableStore(@RequestBody EnableStoreRequest request) {
        storeService.enableStore(request);
    }

    @PutMapping
    public void updateStoreRequest(@StoreId int storeId, @RequestBody UpdateStoreRequest request) {
        storeService.updateStore(storeId, request);
    }

    @GetMapping
    public StoreResponse get(@StoreId int storeId) {
        return storeService.getStoreById(storeId);
    }
}
