package vn.hust.omni.sale.service.store.application.model.location;

import com.fasterxml.jackson.annotation.JsonRootName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import vn.hust.omni.sale.shared.common_validator.annotation.Phone;

import java.util.Optional;

@Setter
@Getter
public class LocationCreateRequest {
    private Optional<@Size(max = 255) String> code;
    @NotNull
    @Size(max = 128)
    private String name;
    private Optional<@Email @Size(max = 255) String> email;
    private Optional<@Phone @Size(max = 50) String> phone;
    private Optional<@Size(max = 50) String> countryCode;
    private Optional<@Size(max = 50) String> provinceCode;
    private Optional<@Size(max = 50) String> districtCode;
    private Optional<@Size(max = 50) String> wardCode;
    private Optional<@Size(max = 255) String> address1;
    private Boolean defaultLocation;
}
