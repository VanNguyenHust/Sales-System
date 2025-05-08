package vn.hust.omni.sale.service.metafield.application.service.definition;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Lists;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.Assert;
import vn.hust.omni.sale.service.metafield.application.constant.MetafieldDefinitionTypeConstant;
import vn.hust.omni.sale.service.metafield.application.model.metafieldefinition.*;
import vn.hust.omni.sale.service.metafield.application.service.mapper.MetafieldDefinitionMapper;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldService;
import vn.hust.omni.sale.service.metafield.application.service.metafield.MetafieldUtils;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.metafield.domain.repository.JpaMetafieldDefinitionRepository;
import vn.hust.omni.sale.service.metafield.domain.repository.JpaMetafieldValidateInvalidRepository;
import vn.hust.omni.sale.shared.common_util.JsonUtils;
import vn.hust.omni.sale.shared.common_validator.exception.ErrorMessage;
import vn.hust.omni.sale.shared.common_validator.exception.NotFoundException;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetafieldDefinitionService {
    private final JpaMetafieldDefinitionRepository metafieldDefinitionRepository;
    private final JpaMetafieldValidateInvalidRepository metafieldValidateInvalidRepository;
    private final MetafieldUtils metafieldUtils;
    private final TransactionTemplate transactionTemplate;

    private final ApplicationEventPublisher eventPublisher;

    private final ObjectMapper json;
    private final MetafieldDefinitionMapper metafieldDefinitionMapper;

    public MetafieldDefinitionResponse add(int storeId, MetafieldDefinitionCreateRequest request) {
        metafieldUtils.checkWritePermission(request.getOwnerResource());
        var result = transactionTemplate.execute(status -> {
            validateDefinitionLimit(storeId);
            validateUniqueKey(storeId, request.getKey(), request.getNamespace(), request.getOwnerResource());

            var entity = MetafieldDefinition.builder()
                    .storeId(storeId)
                    .description(request.getDescription())
                    .key(request.getKey())
                    .name(request.getName())
                    .namespace(request.getNamespace())
                    .type(request.getType())
                    .ownerResource(request.getOwnerResource())
                    .pin(request.getPin())
                    .build();

            if (request.getValidations() != null) {
                entity.setValidations(request.getValidations().stream()
                        .map(validation -> new MetafieldDefinition.ValidationUpdate(validation.getName(),
                                validation.getValue().trim()))
                        .toList());
            }

            return metafieldDefinitionRepository.save(entity);
        });

        Assert.notNull(result, "result must not be null");

        return metafieldDefinitionMapper.toResponse(result);
    }

    public MetafieldDefinitionResponse update(int storeId, MetafieldDefinitionUpdateRequest request) {
        var result = transactionTemplate.execute(status -> {
            metafieldUtils.checkWritePermission(request.getOwnerResource());
            var definition = metafieldDefinitionRepository.findByStoreIdAndKeyAndNamespaceAndOwnerResource(storeId,
                            request.getKey(), request.getNamespace(), request.getOwnerResource())
                    .orElseThrow(NotFoundException::new);
            var type = definition.getType();
            validateMetafieldDefinition(type, request.getValidations());
            if (request.getDescription() != null && !request.getDescription().equals(definition.getDescription())) {
                definition.setDescription(request.getDescription());
            }
            if (request.getName() != null && !request.getName().equals(definition.getName())) {
                definition.setName(request.getName());
            }
            if (request.getPin() != null && !Objects.equals(request.getPin(), definition.isPin())) {
                definition.setPin(request.getPin());
            }
            var validations = request.getValidations();
            if (validations != null) {
                definition.setValidations(validations.stream()
                        .map(validation -> new MetafieldDefinition.ValidationUpdate(validation.getName(),
                                validation.getValue().trim()))
                        .toList());
            }
            metafieldDefinitionRepository.save(definition);
            return definition;
        });
        Assert.notNull(result, "result must not be null");

        return metafieldDefinitionMapper.toResponse(result);
    }

    public void remove(int storeId, int id, boolean deleteAllAssociatedMetafields) {
        var result = transactionTemplate.execute(status -> {
            var definition = metafieldDefinitionRepository.findByStoreIdAndId(storeId, id)
                    .orElseThrow(NotFoundException::new);
            metafieldUtils.checkDeletePermission(definition.getOwnerResource());
            metafieldDefinitionRepository.delete(definition);
            metafieldValidateInvalidRepository.deleteByStoreIdAndDefinitionId(storeId, definition.getId());
            return definition;
        });
        if (result != null) {
            eventPublisher.publishEvent(MetafieldDefinitionLog.builder()
                    .id(result.getId())
                    .storeId(result.getStoreId())
                    .name(result.getName())
                    .namespace(result.getNamespace())
                    .key(result.getKey())
                    .type(result.getType())
                    .ownerResource(result.getOwnerResource().name())
                    .verb(MetafieldDefinitionLog.Verb.DELETE)
                    .deleteAllAssociatedMetafields(deleteAllAssociatedMetafields)
                    .build());
        }
    }

    private void validateDefinitionLimit(int storeId) {
        long countDefinitionByStore = metafieldDefinitionRepository.countByStoreId(storeId);
        if (countDefinitionByStore > 250) {
            throwConstraintViolationException("resource_type_limit_exceeded", "Stores can only have 250 definitions for each store resource.");
        }
    }

    private void throwConstraintViolationException(String code, String message, String... fields) {
        throw new ConstraintViolationException(
                UserError.builder()
                        .code(code)
                        .message(message)
                        .fields(Arrays.asList(fields))
                        .build()
        );
    }

    private void validateUniqueKey(int storeId, String key, String namespace, MetafieldDefinitionOwnerType ownerResource) {
        metafieldDefinitionRepository.findByStoreIdAndKeyAndNamespaceAndOwnerResource(storeId, key, namespace, ownerResource).ifPresent(definition -> throwConstraintViolationException("taken", String.format("Key is in use for %s metafields on the '%s' namespace.", ownerResource.name(), namespace), "key"));
    }

    private void validateMetafieldDefinition(String type, List<MetafieldDefinitionValidationRequest> validations) {
        ErrorMessage.ErrorMessageBuilder errors = ErrorMessage.builder();

        if (validations == null || validations.isEmpty()) {
            return;
        }

        checkSupportValidationByType(errors, validations, type);

        switch (type) {
            case MetafieldDefinitionTypeConstant.SINGLE_LINE_TEXT_FIELD -> {
                var checkHasValidateChoices = validations.stream().filter(x -> "choices".equals(x.getName())).findFirst();
                if (checkHasValidateChoices.isPresent() && validations.size() > 1) {
                    errors.addError(userErrorInvalidOption("The Validations option must be the only option used when providing."));
                    throw new ConstraintViolationException(errors.build());
                }
                checkMetafieldDefinitionValidationChoices(errors, validations);
                checkMetafieldDefinitionValidationRegex(errors, validations);
            }
            case MetafieldDefinitionTypeConstant.NUMBER_DECIMAL -> {
                var maxPrecision = validations.stream().filter(x -> x.getName().equals("max_precision")).findFirst();
                if (maxPrecision.isPresent()) {
                    if (errors.build().getUserErrors().isEmpty()) {
                        if (Integer.parseInt(maxPrecision.get().getValue()) > 9) {
                            errors.addError(userErrorInvalidOption("Validations 'max_precision' can't exceed the precision of 9."));
                        }
                    }
                }
                checkMetafieldDefinitionValidationMinMax(
                        errors,
                        validations,
                        MetafieldDefinitionTypeConstant.NUMBER_DECIMAL
                );
            }
            case MetafieldDefinitionTypeConstant.DATE_TIME ->
                checkMetafieldDefinitionValidationMinMax(
                        errors, validations,
                        MetafieldDefinitionTypeConstant.DATE_TIME
                );
        }

        var userErrors = errors.build();
        if (userErrors.getUserErrors() != null && !userErrors.getUserErrors().isEmpty()) {
            throw new ConstraintViolationException(errors.build());
        }
    }

    private void checkMetafieldDefinitionValidationChoices(ErrorMessage.ErrorMessageBuilder errors, List<MetafieldDefinitionValidationRequest> validations) {
        validations.stream()
                .filter(v -> "choices".equals(v.getName()))
                .findFirst()
                .ifPresent(validationChoices -> {
                    try {
                        var listTextValue = json.readValue(validationChoices.getValue(), ListStringParseValidate.class);
                        listTextValue = listTextValue.stream()
                                .map(String::trim)
                                .collect(Collectors.toCollection(ListStringParseValidate::new));
                        if (listTextValue.size() > 128) {
                            errors.addError(userErrorInvalidOption("Limit 128 options."));
                        } else if (new HashSet<>(listTextValue).size() < listTextValue.size()) {
                            errors.addError(userErrorInvalidOption("Validations has duplicate choices."));
                        } else {
                            validationChoices.setValue(json.writeValueAsString(listTextValue));
                        }
                    } catch (Exception e) {
                        errors.addError(userErrorInvalidOption("Validations value for option choices must be a single line text string."));
                    }
                });
    }

    private void checkSupportValidationByType(ErrorMessage.ErrorMessageBuilder errors, List<MetafieldDefinitionValidationRequest> validations, String type) {
        List<String> validationNameSupports = new ArrayList<>();

        switch (type) {
            case MetafieldDefinitionTypeConstant.SINGLE_LINE_TEXT_FIELD ->
                    validationNameSupports = Lists.newArrayList("min", "max", "regex", "choices");

            case MetafieldDefinitionTypeConstant.DATE_TIME ->
                    validationNameSupports = Lists.newArrayList("min", "max");

            case MetafieldDefinitionTypeConstant.NUMBER_DECIMAL ->
                    validationNameSupports = Lists.newArrayList("min", "max", "max_precision");
        }

        List<String> finalList = validationNameSupports;
        List<MetafieldDefinitionValidationRequest> validationNotSupports = validations
                .stream()
                .filter(c -> !finalList.contains(c.getName()))
                .toList();
        validationNotSupports.stream().map(validation -> userErrorInvalidOption(String.format("Validations value for option %s contains an invalid value: '%s' isn't supported for %s.", validation.getName(), validation.getName(), type))).forEach(errors::addError);
        var userErrors = errors.build();
        if (userErrors.getUserErrors() != null && !userErrors.getUserErrors().isEmpty()) {
            throw new ConstraintViolationException(errors.build());
        }
    }

    private void checkMetafieldDefinitionValidationMinMax(ErrorMessage.ErrorMessageBuilder errors,
                                                          List<MetafieldDefinitionValidationRequest> validations,
                                                          String valueType) {
        String min = null;
        String max = null;
        var checkDuplicateValidationMax =
                validations.stream().filter(x -> "max".equals(x.getName())).toList();
        var checkDuplicateValidationMin =
                validations.stream().filter(x -> "min".equals(x.getName())).toList();
        if (checkDuplicateValidationMax.size() >= 2 || checkDuplicateValidationMin.size() >= 2) {
            errors.addError(UserError.builder()
                    .code("duplicate_option")
                    .message("Validations cannot contain duplicate \"name\" options.")
                    .fields(List.of("validations"))
                    .build());
        } else {
            for (var validation : validations.stream().filter(x -> List.of("min", "max").contains(x.getName())).toList()) {
                if (checkMetafieldDefinitionValidationByType(errors, valueType, validation)
                ) {
                    if ("min".equals(validation.getName())) {
                        min = validation.getValue();
                    }
                    if ("max".equals(validation.getName())) {
                        max = validation.getValue();
                    }
                }
            }
            compareValidationMinMaxByType(errors, min, max, valueType);
        }
    }

    private boolean checkMetafieldDefinitionValidationByType(ErrorMessage.ErrorMessageBuilder errors,
                                                             String valueType,
                                                             MetafieldDefinitionValidationRequest validationRequest) {
        if (valueType.equals(MetafieldDefinitionTypeConstant.NUMBER_DECIMAL)) {
            try {
                new BigDecimal(validationRequest.getValue());
            } catch (Exception e) {
                errors.addError(userErrorInvalidOption("Validations value for option %s must be a decimal."));
                return false;
            }
        }

        if (valueType.equals(MetafieldDefinitionTypeConstant.DATE_TIME)) {
            var fullFormatDateTime = valueType.equals(MetafieldDefinitionTypeConstant.DATE_TIME);
            var validDate = MetafieldService.dateParseByFormat(validationRequest.getValue(), fullFormatDateTime);
            if (validDate == null) {
                var formatEx = fullFormatDateTime ? "“YYYY-MM-DDTHH:MM:SS”" : "“YYYY-MM-DD”";
                errors.addError(userErrorInvalidOption("Validations value for option min must be in " + formatEx + " format"));
                return false;
            }
        }
        return true;
    }

    private void compareValidationMinMaxByType(ErrorMessage.ErrorMessageBuilder errors, String min, String max,
                                               String valueType) {
        var valid = true;
        if (min != null && max != null) {
            if (valueType.equals(MetafieldDefinitionTypeConstant.NUMBER_DECIMAL)) {
                if (new BigDecimal(min).compareTo(new BigDecimal(max)) > 0) {
                    valid = false;
                }
            }
            if (valueType.equals(MetafieldDefinitionTypeConstant.DATE_TIME)) {
                if ((DateTime.parse(min).compareTo(DateTime.parse(max)) > 0)) {
                    valid = false;
                }
            }
        }
        if (!valid) {
            errors.addError(userErrorInvalidOption("Validations contains an invalid value: 'min' must be less than 'max'."));
        }
    }

    private void checkMetafieldDefinitionValidationRegex(ErrorMessage.ErrorMessageBuilder errors, List<MetafieldDefinitionValidationRequest> validations) {
        Optional<MetafieldDefinitionValidationRequest> validationRequestRegex = validations.stream().
                filter(p -> p.getName().equals("regex")).
                findFirst();
        if (validationRequestRegex.isPresent()) {
            try {
                Pattern.compile(validationRequestRegex.get().getValue());
            } catch (PatternSyntaxException e) {
                errors.addError(userErrorInvalidOption("Validations has the following regex error."));
            }
        }
    }

    private UserError userErrorInvalidOption(String messageError) {
        return UserError.builder()
                .code("invalid_option")
                .fields(List.of("validations"))
                .message(messageError)
                .build();
    }

}
