package com.ebanking.core.repository.nosql;

import com.ebanking.core.model.nosql.SecurityLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SecurityLogRepository extends MongoRepository<SecurityLog, String> {

    List<SecurityLog> findByUserId(Long userId);

    List<SecurityLog> findByUsername(String username);

    List<SecurityLog> findByIpAddress(String ipAddress);

    List<SecurityLog> findByEventType(SecurityLog.SecurityEventType eventType);

    List<SecurityLog> findByEventStatus(SecurityLog.SecurityEventStatus eventStatus);

    List<SecurityLog> findByTimestampBetween(Date startDate, Date endDate);

    List<SecurityLog> findBySessionId(String sessionId);

    @Query("{ 'userId': ?0, 'eventType': ?1 }")
    List<SecurityLog> findByUserIdAndEventType(Long userId, SecurityLog.SecurityEventType eventType);

    @Query("{ 'eventStatus': 'FAILURE', 'ipAddress': ?0 }")
    List<SecurityLog> findFailedAttemptsByIpAddress(String ipAddress);

    @Query("{ 'eventType': 'LOGIN_ATTEMPT', 'userId': ?0, 'timestamp': { $gte: ?1 } }")
    List<SecurityLog> findRecentLoginAttempts(Long userId, Date since);

    @Query(value = "{ 'eventType': 'SUSPICIOUS_ACTIVITY' }", sort = "{ 'timestamp': -1 }")
    List<SecurityLog> findLatestSuspiciousActivities(Pageable pageable);

    @Query("{ 'eventType': 'LOGIN_ATTEMPT', 'eventStatus': 'FAILURE', 'username': ?0, 'timestamp': { $gte: ?1 } }")
    List<SecurityLog> findFailedLoginAttemptsByUsernameAfterDate(String username, Date date);

    @Query("{ 'geoLocation': { $ne: null }, 'userId': ?0 }")
    List<SecurityLog> findDistinctGeoLocationsForUser(Long userId);

    @Query(value = "{ 'eventStatus': 'BLOCKED' }", count = true)
    long countBlockedEvents();
}