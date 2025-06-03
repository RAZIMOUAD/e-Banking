package com.ebanking.core.dto.system;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemParameterRequest {
    @NotBlank
    private String paramKey;

    @NotBlank
    private String paramValue;

    private String defaultValue;
    private String description;
    private String category;
    private String dataType;
    private boolean isEditable;
    private boolean isRequired;
    private String validationRule;
}