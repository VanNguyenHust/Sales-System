package vn.hust.omni.sale.service.store.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.hust.omni.sale.service.store.application.model.store.RegisterStoreRequest;
import vn.hust.omni.sale.service.store.application.service.StoreService;

@RestController
@RequestMapping(value = "/administrator")
@RequiredArgsConstructor
public class AdministratorController {
    private final StoreService storeService;

    @PostMapping("/store/register")
    public void registerStore(@RequestBody RegisterStoreRequest request) {
        storeService.registerStore(request);
    }
}
