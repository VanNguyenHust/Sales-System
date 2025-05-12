package vn.hust.omni.sale.service.product.domain.ddd;

public interface DomainRule {

    boolean isBroken();

    String message();

}
