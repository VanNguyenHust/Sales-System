package vn.hust.omni.sale.service.metafield.application.service.metafield;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldSet;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MetafieldUtils {
    private static final SimpleGrantedAuthority PERMISSION_FULL = new SimpleGrantedAuthority("ROLE_full");

    public enum Action {
        GET, POST, PUT, DELETE
    }

    public void checkReadPermission(MetafieldDefinitionOwnerType ownerType) {
        checkPermission(List.of(ownerType.name()), Action.GET);
    }

    public void checkWritePermission(List<String> ownerResources) {
        checkPermission(ownerResources, Action.POST);
        checkPermission(ownerResources, Action.PUT);
    }

    public void checkWritePermission(MetafieldDefinitionOwnerType ownerType) {
        checkWritePermission(List.of(ownerType.name()));
    }

    public void checkDeletePermission(List<String> ownerResources) {
        checkPermission(ownerResources, Action.DELETE);
    }

    public void checkDeletePermission(MetafieldDefinitionOwnerType ownerType) {
        checkPermission(List.of(ownerType.name()), Action.DELETE);
    }

    private void checkPermission(List<String> ownerResources, Action action) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var hasPermissionFull = authentication.getAuthorities().stream()
                .anyMatch(PERMISSION_FULL::equals);
        if (hasPermissionFull) return;
        var userPermissions = authentication.getAuthorities();
        ownerResources.stream()
                .map(ownerResource -> getPermissionByOwnerResource(ownerResource, action))
                .forEach(permissionNeed -> {
                    if (permissionNeed.isEmpty()) return;
                    if (userPermissions.stream().noneMatch(permissionNeed::contains)) {
                        throw new ConstraintViolationException(UserError.builder()
                                .code("access_denied")
                                .message("Access denied. Required access: the same access level needed to mutate the owner resource.")
                                .build()
                        );
                    }
                });
    }

    private List<String> getScopeByOwnerResource(String ownerResource, Action action) {
        var scope = new ArrayList<String>();
        switch (ownerResource) {
            case "product":
                if (action == Action.GET) {
                    scope.add("read_products");
                } else {
                    scope.add("write_products");
                }
                break;
            case "customer":
                if (action == Action.GET) {
                    scope.add("read_customers");
                } else {
                    scope.add("write_customers");
                }
            case "order":
                if (action == Action.GET) {
                    scope.add("read_orders");
                } else {
                    scope.add("write_orders");
                }
                break;
        }
        return scope;
    }

    private List<SimpleGrantedAuthority> getPermissionByOwnerResource(String ownerResource, Action action) {
        var permissions = new ArrayList<String>();
        switch (ownerResource) {
            case "product":
                permissions.add("products");
                if (action == Action.GET) {
                    permissions.add("read_products");
                } else if (action == Action.POST || action == Action.PUT) {
                    permissions.add("create_products");
                    permissions.add("update_products");
                } else if (action == Action.DELETE) {
                    permissions.add("update_products");
                }
                break;
            case "customer":
                permissions.add("customers");
                if (action == Action.GET) {
                    permissions.add("read_customers");
                } else if (action == Action.POST || action == Action.PUT) {
                    permissions.add("create_customers");
                    permissions.add("update_customers");
                } else if (action == Action.DELETE) {
                    permissions.add("update_customers");
                }
            case "order":
                permissions.add("orders");
                if (action == Action.GET) {
                    permissions.add("read_orders");
                    permissions.add("read_assigned_orders");
                } else if (action == Action.POST || action == Action.PUT) {
                    permissions.add("create_orders");
                    permissions.add("update_orders");
                } else if (action == Action.DELETE) {
                    permissions.add("update_orders");
                }
                break;
        }
        return permissions.stream().map(a -> "ROLE_" + a)
                .map(SimpleGrantedAuthority::new).toList();
    }

    public MetafieldSet convertEntityToMetafieldSet(Metafield metafield) {
        return new MetafieldSet(
                Optional.of(metafield.getId()),
                metafield.getKey(),
                metafield.getNamespace(),
                metafield.getValue(),
                metafield.getValueType(),
                metafield.getOwnerId(),
                metafield.getOwnerResource());
    }
}
