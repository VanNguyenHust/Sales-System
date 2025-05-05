package vn.hust.omni.sale.service.store.application.constant;

import java.util.List;
import java.util.stream.Stream;

public enum Role {
    store_settings,
    location_settings,
    read_customers,
    create_customers,
    update_customers,
    delete_customers,
    read_products,
    create_products,
    update_products,
    delete_products,
    read_orders,
    create_orders,
    update_orders,
    delete_orders,
    cancel_orders,
    create_returns,
    refund_returns,
    cancel_returns,
    read_returns;

    public static List<String> getPermissions() {
        return Stream.of(Role.values())
                .map(Enum::name)
                .toList();
    }
}
