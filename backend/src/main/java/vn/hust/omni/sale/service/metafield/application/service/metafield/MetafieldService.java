package vn.hust.omni.sale.service.metafield.application.service.metafield;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.hust.omni.sale.service.metafield.application.constant.MetafieldDefinitionTypeConstant;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldRequest;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldResponse;
import vn.hust.omni.sale.service.metafield.application.model.metafield.MetafieldSet;
import vn.hust.omni.sale.service.metafield.application.service.mapper.MetafieldMapper;
import vn.hust.omni.sale.service.metafield.application.service.metafield.validator.MetafieldValidatorProvider;
import vn.hust.omni.sale.service.metafield.domain.model.Metafield;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinition;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionOwnerType;
import vn.hust.omni.sale.service.metafield.domain.model.MetafieldDefinitionValidation;
import vn.hust.omni.sale.service.metafield.domain.repository.JpaMetafieldDefinitionRepository;
import vn.hust.omni.sale.service.metafield.domain.repository.JpaMetafieldDefinitionValidationRepository;
import vn.hust.omni.sale.service.metafield.domain.repository.JpaMetafieldRepository;
import vn.hust.omni.sale.service.metafield.infrastructure.specification.MetafieldDefinitionValidationSpecification;
import vn.hust.omni.sale.service.metafield.infrastructure.specification.MetafieldSpecification;
import vn.hust.omni.sale.shared.common_util.OptionalUtils;
import vn.hust.omni.sale.shared.common_validator.exception.ConstraintViolationException;
import vn.hust.omni.sale.shared.common_validator.exception.ErrorMessage;
import vn.hust.omni.sale.shared.common_validator.exception.UserError;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetafieldService {
    private final JpaMetafieldRepository metafieldRepository;
    private final JpaMetafieldDefinitionRepository metafieldDefinitionRepository;
    private final JpaMetafieldDefinitionValidationRepository metafieldDefinitionValidationRepository;

    private final MetafieldValidatorProvider metafieldValidatorProvider;

    private final MetafieldMapper metafieldMapper;

    public List<Metafield> filterBatch(int storeId, int ownerResourceId,
                                       MetafieldDefinitionOwnerType ownerResource,
                                       List<String> keys, List<String> namespaces) {
        return metafieldRepository.findAll(MetafieldSpecification.filterBatch(storeId, ownerResourceId, ownerResource.name(), keys, namespaces));
    }

    public Map<String, Integer> filterCountsByNamespaceAndKeyAndOwnerResource(int storeId, List<String> namespaces, List<String> keys, List<String> ownerResources) {
        List<Object[]> rows = metafieldRepository.filterCountsByNamespaceAndKeyAndOwnerResource(storeId, namespaces, keys, ownerResources);

        return rows.stream().collect(Collectors.toMap(
                row -> row[0] + ":" + row[1] + ":" + row[2],
                row -> ((Long) row[3]).intValue()
        ));    }

    public void removeByDefinition(int storeId, MetafieldDefinitionOwnerType ownerResource, String namespace, String key) {
        metafieldRepository.deleteByDefinition(storeId, ownerResource.name(), namespace, key);
    }

    public void save(List<Metafield> metafields, int ownerResourceId) {
        for (var metafield : metafields) {
            if (metafield.getId() == 0) {
                metafield.setOwnerId(ownerResourceId);
            }
        }
        metafieldRepository.saveAll(metafields);
    }

    public List<MetafieldResponse> sets(int storeId, List<MetafieldSet> metafields) {
        var metafieldsResponse = new ArrayList<Metafield>();
        ErrorMessage.ErrorMessageBuilder errors = ErrorMessage.builder();
        for (int i = 0; i < metafields.size(); i++) {
            var set = metafields.get(i);
            var reqOwnerResourceId = set.getOwnerId();
            var reqOwnerResource = set.getOwnerResource();
            var owner =
                    metafieldValidatorProvider.getObjectReferenceValidator().getObjectReferenceByType(
                            reqOwnerResource + "_reference",
                            String.valueOf(reqOwnerResourceId),
                            storeId
                    );
            if (!owner.isEmpty()) {
                errors.addError(UserError.builder()
                        .message("Owner does not exist.")
                        .fields(List.of("metafields", String.valueOf(i), "owner"))
                        .build());
            } else {
                var metafieldRequest = convertMetafieldSetToRequest(set);
                validateMetafieldByTypeAndDefinition(storeId, errors, metafieldRequest, i, MetafieldDefinitionOwnerType.valueOf(set.getOwnerResource()));
                try {
                    var metafield = validateAndGenerateMetafields(storeId, set.getOwnerId(), MetafieldDefinitionOwnerType.valueOf(set.getOwnerResource()),
                            Collections.singletonList(metafieldRequest));
                    metafieldsResponse.addAll(metafield);
                } catch (ConstraintViolationException e) {
                    var message = e.getMessage();
                    if (message.contains("must be unique within this namespace on this resource")) {
                        errors.addError(UserError.builder()
                                .message("must be unique within this namespace on this resource")
                                .fields(List.of("metafields", String.valueOf(i), "key"))
                                .build());
                    }
                }
            }
        }
        var userErrors = errors.build();
        if (userErrors.getUserErrors() != null && !userErrors.getUserErrors().isEmpty()) {
            throw new ConstraintViolationException(errors.build());
        }
        metafieldRepository.saveAll(metafieldsResponse);
        return metafieldsResponse.stream().map(metafieldMapper::toResponse).toList();
    }

    public int filterCountByNamespaceAndKeyAndOwnerResource(int storeId, String namespace, String key, MetafieldDefinitionOwnerType ownerResource) {
        return metafieldRepository.countByStoreIdAndNamespaceAndKeyAndOwnerResource(storeId, namespace, key, ownerResource.name());
    }

    private MetafieldRequest convertMetafieldSetToRequest(MetafieldSet set) {
        var metafieldRequest = new MetafieldRequest();
        metafieldRequest.setKey(Optional.ofNullable(set.getKey()));
        metafieldRequest.setNamespace(Optional.ofNullable(set.getNamespace()));
        metafieldRequest.setId(set.getId());
        metafieldRequest.setValueType(Optional.ofNullable(set.getValueType()));
        metafieldRequest.setValue(Optional.ofNullable(set.getValue()));
        return metafieldRequest;
    }

    public MetafieldResponse upsert(int storeId, int ownerResourceId, MetafieldDefinitionOwnerType ownerResource, MetafieldRequest metafieldRequest) {
        //xử lý trường hợp khi tạo mới mà truyền key & namespace đã tồn tại thì update
        var reqKey = detectKey(metafieldRequest.getKey());
        var reqNamespace = detectNameSpace(metafieldRequest.getNamespace());
        var id = OptionalUtils.getValue(metafieldRequest.getId(), 0);
        //check id == 0 để đảm bảo là không truyền id / không có ý định truyền id (tạo mới / update mà không truyền id)
        if (!StringUtils.isBlank(reqKey) && !StringUtils.isBlank(reqNamespace) && ownerResourceId > 0 && id == 0) {
            var existedMetafield = metafieldRepository.findByNamespaceAndKeyAndOwnerResourceAndOwnerIdAndStoreId(reqNamespace, reqKey, ownerResource.name(), ownerResourceId, storeId);
            if (existedMetafield != null)
                metafieldRequest.setId(Optional.of(existedMetafield.getId()));
        }

        var metafields = upsert(storeId, ownerResourceId, ownerResource, List.of(metafieldRequest));
        if (metafields.isEmpty())
            return null;
        return metafieldMapper.toResponse(metafields.get(0));
    }

    public List<Metafield> upsert(int storeId, int ownerResourceId, MetafieldDefinitionOwnerType ownerResource, List<MetafieldRequest> metafieldRequests) {
        var metafields = validateAndGenerateMetafields(storeId, ownerResourceId, ownerResource, metafieldRequests);
        validateMetafieldByTypeAndDefinition(storeId, metafieldRequests, ownerResource);
        metafieldRepository.saveAll(metafields);
        return metafields;
    }

    public List<Metafield> validateAndGenerateMetafields(int storeId, int ownerResourceId, MetafieldDefinitionOwnerType ownerResourceType, List<MetafieldRequest> metafieldRequests) {
        List<Metafield> addOrUpdates = new ArrayList<>();
        if (metafieldRequests == null || metafieldRequests.isEmpty())
            return addOrUpdates;

        val ids = metafieldRequests.stream()
                .filter(req -> req != null && Optional.ofNullable(req.getId()).isPresent())
                .map(req -> req.getId().orElse(null))
                .filter(Objects::nonNull)
                .toList();

        var metafieldSpecification = Specification.where(MetafieldSpecification.hasStoreId(storeId))
                .and(MetafieldSpecification.hasOwnerResource(ownerResourceType.name()))
                .and(MetafieldSpecification.hasIdsIn(ids));
        val oldMetafields = metafieldRepository.findAll(metafieldSpecification);

        for (var req : metafieldRequests) {
            var id = Optional.ofNullable(req.getId()).isPresent() ? req.getId().orElse(0) : 0;

            Metafield metafield = oldMetafields.stream().filter(m -> m.getId() == id).findFirst().orElse(null);

            var reqKey = detectKey(req.getKey());
            var reqNamespace = detectNameSpace(req.getNamespace());

            if (metafield == null) {
                var dateNow = Instant.now();
                //create new metafield
                metafield = new Metafield();

                validateUniqueKeyInNameSpace(reqKey, reqNamespace, ownerResourceType, ownerResourceId, storeId);

                metafield.setKey(reqKey);
                metafield.setNamespace(reqNamespace);
                metafield.setStoreId(storeId);
                metafield.setOwnerId(ownerResourceId);
                metafield.setOwnerResource(ownerResourceType.name());
                metafield.setCreatedOn(dateNow);
                metafield.setModifiedOn(dateNow);
                setUpdatableInfo(req, metafield);
            } else {
                //process update metafield
                internalUpdate(metafield, req);
            }

            val keyExistedInNamespace = addOrUpdates.stream()
                    .anyMatch(a -> StringUtils.equals(a.getKey(), reqKey)
                                   && StringUtils.equals(a.getNamespace(), reqNamespace));
            if (keyExistedInNamespace) {
                throw new ConstraintViolationException("key", "must be unique within this namespace on this resource");
            }

            addOrUpdates.add(metafield);
        }

        return addOrUpdates;
    }

    public void validateMetafieldByTypeAndDefinition(int storeId, List<MetafieldRequest> requests, MetafieldDefinitionOwnerType ownerResource) {
        if (requests != null) {
            ErrorMessage.ErrorMessageBuilder errors = ErrorMessage.builder();
            for (int i = 0; i < requests.size(); i++) {
                validateMetafieldByTypeAndDefinition(storeId, errors, requests.get(i), i, ownerResource);
            }
            var userErrors = errors.build();
            if (userErrors.getUserErrors() != null && !userErrors.getUserErrors().isEmpty()) {
                throw new ConstraintViolationException(errors.build());
            }
        }
    }

    private void internalUpdate(Metafield metafield, MetafieldRequest metafieldRequest) {
        validateCannotUpdateKey(metafield, metafieldRequest.getKey());
        validateCannotUpdateNamespace(metafield, metafieldRequest.getNamespace());
        setUpdatableInfo(metafieldRequest, metafield);
        metafield.setModifiedOn(Instant.now());
    }

    private void validateUniqueKeyInNameSpace(String reqKey, String reqNamespace, MetafieldDefinitionOwnerType ownerResourceType, int ownerId, int storeId) {
        if (!StringUtils.isBlank(reqKey) && !StringUtils.isBlank(reqNamespace) && ownerId > 0) {
            var verifyMetafield = metafieldRepository.findByNamespaceAndKeyAndOwnerResourceAndOwnerIdAndStoreId(reqNamespace, reqKey, ownerResourceType.name(), ownerId, storeId);
            if (verifyMetafield != null) {
                throw new ConstraintViolationException("key", "must be unique within this namespace on this resource");
            }
        }
    }

    private void validateCannotUpdateKey(Metafield metafield, Optional<String> keyOptional) {
        if (metafield.getId() > 0 && Optional.ofNullable(keyOptional).isPresent()) {
            var key = keyOptional.orElse(null);
            if (!StringUtils.equals(key, metafield.getKey())) {
                throw new ConstraintViolationException(
                        ErrorMessage.builder().addError("key", "can't change. Try creating a new one.").build());
            }
        }
    }

    private void validateCannotUpdateNamespace(Metafield metafield, Optional<String> namespaceOptional) {
        if (metafield.getId() > 0 && Optional.ofNullable(namespaceOptional).isPresent()) {
            var namespace = namespaceOptional.orElse(null);
            if (!StringUtils.equals(namespace, metafield.getNamespace())) {
                throw new ConstraintViolationException("namespace", "can't change. Try creating a new one.");
            }
        }
    }

    private void validateMetafieldByTypeAndDefinition(int storeId, ErrorMessage.ErrorMessageBuilder errors, MetafieldRequest request, int index, MetafieldDefinitionOwnerType ownerResource) {
        MetafieldDefinition definition = null;
        Metafield metafield = null;
        List<MetafieldDefinitionValidation> validations = null;

        var valueOptional = request.getValue();
        var valueTypeOptional = request.getValueType();
        var idOptional = request.getId();
        var namespaceOptional = request.getNamespace();
        var keyOptional = request.getKey();

        var checkHasValue = valueOptional != null && valueOptional.isPresent();
        var checkHasValueType = valueTypeOptional != null && valueTypeOptional.isPresent();
        var checkHasId = idOptional != null && idOptional.isPresent() && idOptional.get() != 0;
        var checkHasNamespace = namespaceOptional != null && namespaceOptional.isPresent();
        var checkHasKey = keyOptional != null && keyOptional.isPresent();

        if ((checkHasNamespace && checkHasKey) || checkHasId) {
            String namespaceDefinition = "";
            if (namespaceOptional != null) {
                namespaceDefinition = namespaceOptional.orElse("");
            }
            String keyDefinition = "";
            if (keyOptional != null) {
                keyDefinition = keyOptional.orElse("");
            }
            if (checkHasId) {
                metafield = metafieldRepository.findByIdAndStoreId(idOptional.get(), storeId);
                if (metafield != null) {
                    namespaceDefinition = metafield.getNamespace();
                    keyDefinition = metafield.getKey();
                }
            }
            if (!namespaceDefinition.isEmpty() && !keyDefinition.isEmpty()) {
                definition = metafieldDefinitionRepository.findByNamespaceAndKeyAndOwnerResourceAndStoreId(
                        namespaceDefinition,
                        keyDefinition,
                        ownerResource,
                        storeId
                );
                if (definition != null) {
                    var specification = Specification.where(
                            MetafieldDefinitionValidationSpecification.hasDefinitionId(definition.getId())
                    ).and(MetafieldDefinitionValidationSpecification.hasStoreId(storeId));
                    validations = metafieldDefinitionValidationRepository.findAll(specification);
                }
            }
        }

        var value = checkHasValue ? valueOptional.get() : "";
        var type = checkHasValueType ? valueTypeOptional.get() : "";

        if (definition != null) {
            if (checkHasValueType) {
                if (!type.equals(definition.getType())) {
                    errors.addError(
                            UserError.builder()
                                    .message(String.format("Type \"%s\" must match the type definition: \"%s\".", type, definition.getType()))
                                    .fields(List.of("metafields", String.valueOf(index), "value_type"))
                                    .build()
                    ).build();
                }
            }
        }

        if (!checkHasValueType) {
            if (definition != null) {
                type = definition.getType();
                checkHasValueType = true;
            } else if (metafield != null) {
                type = metafield.getValueType();
                checkHasValueType = true;
            }
        }

        if (!checkHasValue && metafield != null) {
            value = metafield.getValue();
            checkHasValue = true;
        }

        if (checkHasValue && checkHasValueType) {
            var messageError = "";

            switch (type) {
                case MetafieldDefinitionTypeConstant._BOOLEAN ->
                        messageError = metafieldValidatorProvider.getBooleanValidator().validate(type, value,
                                validations, storeId);
                case MetafieldDefinitionTypeConstant.DATE_TIME ->
                        messageError = metafieldValidatorProvider.getDateTimeValidator().validate(type, value,
                                validations, storeId);
                case MetafieldDefinitionTypeConstant.NUMBER_DECIMAL ->
                        messageError = metafieldValidatorProvider.getNumberDecimalValidator().validate(type, value,
                                validations, storeId);
                case MetafieldDefinitionTypeConstant.SINGLE_LINE_TEXT_FIELD ->
                        messageError = metafieldValidatorProvider.getTextFieldValidator().validate(type, value,
                                validations, storeId);
            }

            if (!messageError.isEmpty()) {
                errors.addError(UserError.builder()
                        .message(messageError)
                        .fields(List.of("metafields", String.valueOf(index), "value"))
                        .build());
            }
        }
    }

    private static void setUpdatableInfo(MetafieldRequest metafieldRequest, Metafield metafield) {
        if (Optional.ofNullable(metafieldRequest.getValueType()).isPresent()) {
            metafield.setValueType(metafieldRequest.getValueType().orElse(null));
        }

        if (Optional.ofNullable(metafieldRequest.getValue()).isPresent()) {
            metafield.setValue(metafieldRequest.getValue().orElse(null));
        }
    }

    private String detectKey(Optional<String> keyOptional) {
        String key = null;

        if (Optional.ofNullable(keyOptional).isPresent()) {
            key = keyOptional.orElse(null);
        }
        return key;
    }

    private String detectNameSpace(Optional<String> namespaceOptional) {
        String namespace = null;

        if (Optional.ofNullable(namespaceOptional).isPresent()) {
            namespace = namespaceOptional.orElse(null);
        }
        return namespace;
    }


    public static String dateParseByFormat(String date, boolean fullFormatDateTime) {
        var result = "";
        boolean containsZ = date.contains("Z");

        DateTimeFormatterBuilder formatterBuilder = new DateTimeFormatterBuilder()
                .appendPattern(fullFormatDateTime ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd");

        if (containsZ && fullFormatDateTime) {
            formatterBuilder.appendLiteral('Z');
        }

        DateTimeFormatter formatter = formatterBuilder.toFormatter();

        try {
            if (fullFormatDateTime) {
                LocalDateTime parsedDate = LocalDateTime.parse(date.trim(), formatter);
                result = parsedDate.format(formatter);
            } else {
                LocalDate parsedDate = LocalDate.parse(date.trim(), formatter);
                result = parsedDate.format(formatter);
            }
        } catch (DateTimeParseException pe) {
            return null;
        }
        if (!result.contains(date)) {
            return null;
        }
        return result;
    }
}
