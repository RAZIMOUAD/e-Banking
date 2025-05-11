package com.ebanking.core.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.ebanking.core")
public class WebMvcConfig implements WebMvcConfigurer {
    // Tu pourras ajouter ici le CORS global ou autres interceptors
}


