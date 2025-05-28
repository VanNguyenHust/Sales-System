package vn.hust.omni.sale.service.customer.application.model;

import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
@JsonRootName("customer")
public class CustomerDto {
    private int id;
    private String state;
    private String email;
    private boolean verifiedEmail;
    private String phone;
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dob;
    private boolean acceptsMarketing;
    private int ordersCount;
    private BigDecimal totalSpent;
    private Integer lastOrderId;
    private String lastOrderName;
    private String tags;
    private String note;
    private Instant createdOn;
    private Instant modifiedOn;
    private List<CustomerAddressDto> addresses;
    private CustomerAddressDto defaultAddress;
}
