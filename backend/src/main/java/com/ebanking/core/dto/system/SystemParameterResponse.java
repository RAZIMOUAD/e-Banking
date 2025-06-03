package com.ebanking.core.dto.system;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemParameterResponse {
    private Long id;
    private String paramKey;
    private String paramValue;
    private String defaultValue;
    private String description;
    private String category;
    private String dataType;
    private boolean isEditable;
    private boolean isRequired;
    private String validationRule;
    private LocalDateTime lastUpdated;
    private String lastUpdatedBy;
}