package com.ebanking.core.config.initializer;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AgentInitializer {
    @Value("${agent.email}")
    private String agentemail;
    @Value("${agent.password}")
    private String agentepassword;




}
