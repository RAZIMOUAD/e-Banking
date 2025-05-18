package com.ebanking.core.model.sql;

import jakarta.persistence.*;
/*
@Entity
@Table(name = "admins")
public class Admin extends User {
/*
    @Column(name = "admin_level")
    @Enumerated(EnumType.STRING)
    private AdminLevel adminLevel;

    @Column(name = "department")
    private String department;

    @Column(name = "can_approve_large_transactions")
    private boolean canApproveLargeTransactions;

    @Column(name = "can_manage_users")
    private boolean canManageUsers;

    @Column(name = "can_manage_system")
    private boolean canManageSystem;

    public enum AdminLevel {
        JUNIOR, SENIOR, SUPER
    }

    // Constructors
    public Admin() {
        super();
        this.addRole("ROLE_ADMIN");
    }

    public Admin(String username, String password, String email, String fullName,
                 String phoneNumber, AdminLevel adminLevel, String department) {
        super(username, password, email, fullName, phoneNumber);
        this.adminLevel = adminLevel;
        this.department = department;
        this.canApproveLargeTransactions = adminLevel != AdminLevel.JUNIOR;
        this.canManageUsers = adminLevel != AdminLevel.JUNIOR;
        this.canManageSystem = adminLevel == AdminLevel.SUPER;
        this.addRole("ROLE_ADMIN");
    }

    // Getters and Setters
    public AdminLevel getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(AdminLevel adminLevel) {
        this.adminLevel = adminLevel;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public boolean isCanApproveLargeTransactions() {
        return canApproveLargeTransactions;
    }

    public void setCanApproveLargeTransactions(boolean canApproveLargeTransactions) {
        this.canApproveLargeTransactions = canApproveLargeTransactions;
    }

    public boolean isCanManageUsers() {
        return canManageUsers;
    }

    public void setCanManageUsers(boolean canManageUsers) {
        this.canManageUsers = canManageUsers;
    }

    public boolean isCanManageSystem() {
        return canManageSystem;
    }

    public void setCanManageSystem(boolean canManageSystem) {
        this.canManageSystem = canManageSystem;
    }
}*/