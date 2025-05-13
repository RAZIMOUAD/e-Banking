package com.ebanking.core.model.nosql;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "security_logs")
public class SecurityLog {

    @Id
    private String id;

    private Long userId;

    private String username;

    private String ipAddress;

    private Date timestamp;

    private SecurityEventType eventType;

    private SecurityEventStatus eventStatus;

    private String details;

    private String userAgent;

    private String deviceInfo;

    private String geoLocation;

    private String sessionId;

    private String attemptedAction;

    private String failureReason;

    public enum SecurityEventType {
        LOGIN_ATTEMPT,
        PASSWORD_CHANGE,
        TWO_FACTOR_AUTHENTICATION,
        ACCOUNT_LOCKOUT,
        INVALID_TOKEN,
        SUSPICIOUS_ACTIVITY,
        PASSWORD_RESET,
        PRIVILEGE_CHANGE,
        CRYPTO_TRANSACTION,
        LARGE_TRANSFER
    }

    public enum SecurityEventStatus {
        SUCCESS, FAILURE, WARNING, BLOCKED
    }

    // Constructeurs
    public SecurityLog() {
        this.timestamp = new Date();
    }

    public SecurityLog(Long userId, String username, String ipAddress, SecurityEventType eventType,
                       SecurityEventStatus eventStatus) {
        this();
        this.userId = userId;
        this.username = username;
        this.ipAddress = ipAddress;
        this.eventType = eventType;
        this.eventStatus = eventStatus;
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public SecurityEventType getEventType() {
        return eventType;
    }

    public void setEventType(SecurityEventType eventType) {
        this.eventType = eventType;
    }

    public SecurityEventStatus getEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(SecurityEventStatus eventStatus) {
        this.eventStatus = eventStatus;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getGeoLocation() {
        return geoLocation;
    }

    public void setGeoLocation(String geoLocation) {
        this.geoLocation = geoLocation;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getAttemptedAction() {
        return attemptedAction;
    }

    public void setAttemptedAction(String attemptedAction) {
        this.attemptedAction = attemptedAction;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    @Override
    public String toString() {
        return "SecurityLog{" +
                "id='" + id + '\'' +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", eventType=" + eventType +
                ", eventStatus=" + eventStatus +
                ", timestamp=" + timestamp +
                ", ipAddress='" + ipAddress + '\'' +
                '}';
    }
}