package vn.hust.omni.sale.service.metafield.interfaces;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldResponse;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldSet;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldService;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldUtils;
import vn.hust.omni.sale.shared.security.StoreId;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/metafields")
@RequiredArgsConstructor
public class MetafieldController {
    private final MetafieldService metafieldService;
    private final MetafieldUtils metafieldUtils;

    @PostMapping("/sets")
    public List<MetafieldResponse> sets(
            @StoreId int storeId, @Valid @RequestBody @Size(min = 1, max = 25) List<MetafieldSet> metafields) {
        var ownerResources = metafields.stream()
                .map(MetafieldSet::getOwnerResource)
                .distinct()
                .collect(Collectors.toList());
        metafieldUtils.checkWritePermission(ownerResources);
        return metafieldService.sets(storeId, metafields);
    }
}
