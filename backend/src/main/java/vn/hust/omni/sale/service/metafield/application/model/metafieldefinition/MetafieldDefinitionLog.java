package vn.hust.omni.sale.service.metafield.application.model.metafieldefinition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MetafieldDefinitionLog {
    private int id;
    private int storeId;
    private String name;
    private String namespace;
    private String key;
    private String type;
    private String ownerResource;
    private Verb verb;
    private boolean deleteAllAssociatedMetafields;

    @Getter
    @AllArgsConstructor
    public enum Verb {
        DELETE("delete"),
        ADD("add"),;

        private final String name;
    }
}
