package com.ebanking.core.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalJsonExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public String handleUnreadable(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException ife) {
            return "🛑 Erreur de format JSON : " + ife.getMessage();
        }
        return "🛑 Requête JSON mal formée : " + ex.getMessage();
    }
}
