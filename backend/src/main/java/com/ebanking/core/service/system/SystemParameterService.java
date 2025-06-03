package com.ebanking.core.service.system;

import com.ebanking.core.dto.system.SystemParameterRequest;
import com.ebanking.core.dto.system.SystemParameterResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemParameterService {

    // TODO: Injecter SystemParameterRepository quand il sera créé
    // private final SystemParameterRepository systemParameterRepository;

    public List<SystemParameterResponse> findAll() {
        log.info("Fetching all system parameters");
        return generateMockParameters();
    }

    public SystemParameterResponse findByKey(String key) {
        log.info("Fetching system parameter by key: {}", key);
        return generateMockParameters().stream()
                .filter(param -> param.getParamKey().equals(key))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Parameter not found with key: " + key));
    }

    public List<SystemParameterResponse> findByCategory(String category) {
        log.info("Fetching system parameters by category: {}", category);
        return generateMockParameters().stream()
                .filter(param -> param.getCategory().equals(category))
                .collect(Collectors.toList());
    }

    public SystemParameterResponse create(SystemParameterRequest request) {
        log.info("Creating new system parameter: {}", request.getParamKey());

        // TODO: Sauvegarder en base de données
        return SystemParameterResponse.builder()
                .id(System.currentTimeMillis())
                .paramKey(request.getParamKey())
                .paramValue(request.getParamValue())
                .defaultValue(request.getDefaultValue())
                .description(request.getDescription())
                .category(request.getCategory())
                .dataType(request.getDataType())
                .isEditable(request.isEditable())
                .isRequired(request.isRequired())
                .validationRule(request.getValidationRule())
                .lastUpdated(LocalDateTime.now())
                .lastUpdatedBy("admin")
                .build();
    }

    public SystemParameterResponse update(String key, SystemParameterRequest request) {
        log.info("Updating system parameter: {}", key);

        SystemParameterResponse existing = findByKey(key);

        return SystemParameterResponse.builder()
                .id(existing.getId())
                .paramKey(key)
                .paramValue(request.getParamValue())
                .defaultValue(existing.getDefaultValue())
                .description(request.getDescription())
                .category(existing.getCategory())
                .dataType(existing.getDataType())
                .isEditable(existing.isEditable())
                .isRequired(existing.isRequired())
                .validationRule(existing.getValidationRule())
                .lastUpdated(LocalDateTime.now())
                .lastUpdatedBy("admin")
                .build();
    }

    public void delete(String key) {
        log.info("Deleting system parameter: {}", key);
        // TODO: Supprimer de la base de données
        // Vérifier si le paramètre peut être supprimé
        SystemParameterResponse param = findByKey(key);
        if (param.isRequired()) {
            throw new RuntimeException("Cannot delete required parameter: " + key);
        }
    }

    public List<SystemParameterResponse> batchUpdate(List<SystemParameterRequest> requests) {
        log.info("Batch updating {} system parameters", requests.size());

        return requests.stream()
                .map(request -> update(request.getParamKey(), request))
                .collect(Collectors.toList());
    }

    public List<SystemParameterResponse> resetToDefaults() {
        log.info("Resetting all system parameters to defaults");

        return generateMockParameters().stream()
                .map(param -> SystemParameterResponse.builder()
                        .id(param.getId())
                        .paramKey(param.getParamKey())
                        .paramValue(param.getDefaultValue())
                        .defaultValue(param.getDefaultValue())
                        .description(param.getDescription())
                        .category(param.getCategory())
                        .dataType(param.getDataType())
                        .isEditable(param.isEditable())
                        .isRequired(param.isRequired())
                        .validationRule(param.getValidationRule())
                        .lastUpdated(LocalDateTime.now())
                        .lastUpdatedBy("system")
                        .build())
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        log.info("Fetching all parameter categories");

        return generateMockParameters().stream()
                .map(SystemParameterResponse::getCategory)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Object exportParameters(String format) {
        log.info("Exporting system parameters in format: {}", format);

        List<SystemParameterResponse> parameters = findAll();

        if ("json".equalsIgnoreCase(format)) {
            return parameters;
        } else if ("csv".equalsIgnoreCase(format)) {
            // TODO: Implémenter l'export CSV
            Map<String, Object> csvExport = new HashMap<>();
            csvExport.put("format", "csv");
            csvExport.put("data", "CSV export not yet implemented");
            csvExport.put("parameters", parameters);
            return csvExport;
        }

        throw new RuntimeException("Unsupported export format: " + format);
    }

    public List<SystemParameterResponse> importParameters(List<SystemParameterRequest> parameters) {
        log.info("Importing {} system parameters", parameters.size());

        return parameters.stream()
                .map(this::create)
                .collect(Collectors.toList());
    }

    // Méthode privée pour générer des paramètres mock
    private List<SystemParameterResponse> generateMockParameters() {
        List<SystemParameterResponse> parameters = new ArrayList<>();

        // Paramètres de sécurité
        parameters.add(SystemParameterResponse.builder()
                .id(1L)
                .paramKey("security.password.min_length")
                .paramValue("8")
                .defaultValue("8")
                .description("Minimum password length required")
                .category("Security")
                .dataType("Integer")
                .isEditable(true)
                .isRequired(true)
                .validationRule("min:6,max:20")
                .lastUpdated(LocalDateTime.now().minusDays(5))
                .lastUpdatedBy("admin")
                .build());

        parameters.add(SystemParameterResponse.builder()
                .id(2L)
                .paramKey("security.max_login_attempts")
                .paramValue("5")
                .defaultValue("5")
                .description("Maximum failed login attempts before lockout")
                .category("Security")
                .dataType("Integer")
                .isEditable(true)
                .isRequired(true)
                .validationRule("min:3,max:10")
                .lastUpdated(LocalDateTime.now().minusDays(10))
                .lastUpdatedBy("admin")
                .build());

        parameters.add(SystemParameterResponse.builder()
                .id(3L)
                .paramKey("security.session_timeout")
                .paramValue("30")
                .defaultValue("30")
                .description("Session timeout in minutes")
                .category("Security")
                .dataType("Integer")
                .isEditable(true)
                .isRequired(true)
                .validationRule("min:15,max:120")
                .lastUpdated(LocalDateTime.now().minusDays(2))
                .lastUpdatedBy("admin")
                .build());

        // Paramètres de transaction
        parameters.add(SystemParameterResponse.builder()
                .id(4L)
                .paramKey("transaction.daily_limit")
                .paramValue("10000.00")
                .defaultValue("10000.00")
                .description("Daily transaction limit per user")
                .category("Transaction")
                .dataType("Decimal")
                .isEditable(true)
                .isRequired(true)
                .validationRule("min:1000,max:100000")
                .lastUpdated(LocalDateTime.now().minusDays(1))
                .lastUpdatedBy("admin")
                .build());

        parameters.add(SystemParameterResponse.builder()
                .id(5L)
                .paramKey("transaction.fee_percentage")
                .paramValue("1.5")
                .defaultValue("1.5")
                .description("Transaction fee percentage")
                .category("Transaction")
                .dataType("Decimal")
                .isEditable(true)
                .isRequired(true)
                .validationRule("min:0,max:5")
                .lastUpdated(LocalDateTime.now().minusDays(7))
                .lastUpdatedBy("admin")
                .build());

        parameters.add(SystemParameterResponse.builder()
                .id(6L)
                .paramKey("transaction.min_transfer_amount")
                .paramValue("10.00")
                .defaultValue("10.00")
                .description("Minimum transfer amount")
                .category("Transaction")
                .dataType("Decimal")
                .isEditable(true)
                .isRequired(true)
                .validationRule("min:1,max:100")
                .lastUpdated(LocalDateTime.now().minusDays(3))
                .lastUpdatedBy("admin")
                .build());

        // Paramètres système
        parameters.add(SystemParameterResponse.builder()
                .id(7L)
                .paramKey("system.maintenance_mode")
                .paramValue("false")
                .defaultValue("false")
                .description("Enable/disable maintenance mode")
                .category("System")
                .dataType("Boolean")
                .isEditable(true)
                .isRequired(true)
                .validationRule("boolean")
                .lastUpdated(LocalDateTime.now().minusDays(15))
                .lastUpdatedBy("admin")
                .build());

        parameters.add(SystemParameterResponse.builder()
                .id(8L)
                .paramKey("system.default_currency")
                .paramValue("USD")
                .defaultValue("USD")
                .description("Default system currency")
                .category("System")
                .dataType("String")
                .isEditable(true)
                .isRequired(true)
                .validationRule("length:3")
                .lastUpdated(LocalDateTime.now().minusDays(20))
                .lastUpdatedBy("admin")
                .build());

        parameters.add(SystemParameterResponse.builder()
                .id(9L)
                .paramKey("system.support_email")
                .paramValue("support@ebanking.com")
                .defaultValue("support@ebanking.com")
                .description("Support email address")
                .category("System")
                .dataType("Email")
                .isEditable(true)
                .isRequired(true)
                .validationRule("email")
                .lastUpdated(LocalDateTime.now().minusDays(30))
                .lastUpdatedBy("admin")
                .build());

        // Paramètres de notification
        parameters.add(SystemParameterResponse.builder()
                .id(10L)
                .paramKey("notification.email_enabled")
                .paramValue("true")
                .defaultValue("true")
                .description("Enable email notifications")
                .category("Notification")
                .dataType("Boolean")
                .isEditable(true)
                .isRequired(false)
                .validationRule("boolean")
                .lastUpdated(LocalDateTime.now().minusDays(5))
                .lastUpdatedBy("admin")
                .build());

        parameters.add(SystemParameterResponse.builder()
                .id(11L)
                .paramKey("notification.sms_enabled")
                .paramValue("true")
                .defaultValue("false")
                .description("Enable SMS notifications")
                .category("Notification")
                .dataType("Boolean")
                .isEditable(true)
                .isRequired(false)
                .validationRule("boolean")
                .lastUpdated(LocalDateTime.now().minusDays(8))
                .lastUpdatedBy("admin")
                .build());

        return parameters;
    }
}