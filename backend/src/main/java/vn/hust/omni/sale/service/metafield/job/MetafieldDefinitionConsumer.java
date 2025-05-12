package vn.hust.omni.sale.service.metafield.job;

import lombok.AllArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.MetafieldDefinitionLog;
import vn.hust.omni.sale.service.metafield.application.service.definition.MetafieldDefinitionService;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldService;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;

@Component
@AllArgsConstructor
public class MetafieldDefinitionConsumer {
    private MetafieldDefinitionService metafieldDefinitionService;
    private MetafieldService metafieldService;

    @Async
    @EventListener
    public void removeAssociatedMetafields(MetafieldDefinitionLog request) {
        if (request.getVerb() != MetafieldDefinitionLog.Verb.DELETE && request.isDeleteAllAssociatedMetafields()) {
            return;
        }
        metafieldService.removeByDefinition(
                request.getStoreId(),
                MetafieldDefinitionOwnerType.valueOf(request.getOwnerResource()),
                request.getNamespace(),
                request.getKey());
    }
}
