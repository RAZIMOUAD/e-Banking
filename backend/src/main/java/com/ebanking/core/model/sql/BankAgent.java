package com.ebanking.core.model.sql;

import jakarta.persistence.*;
import java.util.Date;
/*
@Entity
@Table(name = "bank_agents")
public class BankAgent extends User {
/*
    @Column(name = "employee_id", nullable = false, unique = true)
    private String employeeId;

    @Column(name = "position")
    private String position;

    @Column(name = "branch_code")
    private String branchCode;

    @Column(name = "hire_date")
    @Temporal(TemporalType.DATE)
    private Date hireDate;

    @Column(name = "access_level")
    @Enumerated(EnumType.STRING)
    private AccessLevel accessLevel;

    public enum AccessLevel {
        BASIC, INTERMEDIATE, ADVANCED
    }

    // Constructors
    public BankAgent() {
        super();
        this.addRole("ROLE_AGENT");
    }

    public BankAgent(String username, String password, String email, String fullName,
                     String phoneNumber, String employeeId, String position, String branchCode) {
        super(username, password, email, fullName, phoneNumber);
        this.employeeId = employeeId;
        this.position = position;
        this.branchCode = branchCode;
        this.hireDate = new Date();
        this.accessLevel = AccessLevel.BASIC;
        this.addRole("ROLE_AGENT");
    }

    // Getters and Setters
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public Date getHireDate() {
        return hireDate;
    }

    public void setHireDate(Date hireDate) {
        this.hireDate = hireDate;
    }

    public AccessLevel getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(AccessLevel accessLevel) {
        this.accessLevel = accessLevel;
    }
}*/