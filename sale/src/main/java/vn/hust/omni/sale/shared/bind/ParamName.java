package vn.hust.omni.sale.shared.bind;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ParamName {

    /**
     * The name of the request parameter to bind to.
     */
    String value();
}
