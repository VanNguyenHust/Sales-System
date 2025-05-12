package vn.hust.omni.sale.service.product.domain.ddd;

import lombok.SneakyThrows;
import org.apache.commons.lang3.tuple.Triple;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.ErrorMessage;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public interface ValueObject<T> extends Serializable {
    default boolean sameAs(T other) {
        return Objects.equals(this, other);
    }

    default void checkRule(DomainRule rule) {
        checkRule("base", rule);
    }

    default void checkRule(String errorKey, DomainRule rule) {
        if (rule.isBroken()) {
            throw new ConstraintViolationException(ErrorMessage.builder()
                    .addError(
                            UserError.builder()
                                    .code(rule.getClass().getSimpleName())
                                    .message(rule.message())
                                    .fields(List.of(errorKey))
                                    .build())
                    .addError(errorKey, rule.message()).build());
        }
    }

    /**
     * simple detect diffs
     *
     * @return list of differences Triple of (fieldName, currObjValue, diffObjValue)
     */
    @SneakyThrows
    default List<Triple<String, Object, Object>> getDiffs(T other) {
        if (this.sameAs(other))
            return List.of();
        var result = new ArrayList<Triple<String, Object, Object>>();

        for (var field : this.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            Object value1 = field.get(this);
            Object value2 = field.get(other);
            if (!Objects.equals(value1, value2)) {
                result.add(Triple.of(field.getName(), value1, value2));
            }
        }
        return result;

    }
}


