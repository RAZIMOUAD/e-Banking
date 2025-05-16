package com.ebanking.core.repository.nosql;

import com.ebanking.core.model.nosql.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
/*
@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {

    List<AuditLog> findByUserId(String userId);

    List<AuditLog> findByUsername(String username);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByStatus(String status);

    List<AuditLog> findByTimestampBetween(Date startDate, Date endDate);

    List<AuditLog> findByUserIdAndAction(String userId, String action);

    @Query("{ 'userIp': ?0 }")
    List<AuditLog> findByIpAddress(String ipAddress);

    @Query("{ 'resourceType': ?0, 'resourceId': ?1 }")
    List<AuditLog> findByResource(String resourceType, String resourceId);

    @Query("{ 'timestamp': { $gte: ?0 }, 'action': ?1, 'status': ?2 }")
    List<AuditLog> findRecentActionsByStatus(Date since, String action, String status);

    @Query(value = "{ 'userId': ?0 }", sort = "{ 'timestamp': -1 }")
    List<AuditLog> findLatestActivityByUser(String userId);

    @Query(value = "{ 'status': 'FAILED' }", count = true)
    long countFailedAuditLogs();

    @Query("{ 'timestamp': { $gte: ?0 }, 'userIp': { $in: ?1 } }")
    List<AuditLog> findByTimestampAfterAndIpAddressIn(Date timestamp, List<String> ipAddresses);
}*/