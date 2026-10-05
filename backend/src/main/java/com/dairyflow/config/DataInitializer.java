package com.dairyflow.config;

import com.dairyflow.modules.users.entity.PermissionEntity;
import com.dairyflow.modules.users.entity.RoleEntity;
import com.dairyflow.modules.users.entity.User;
import com.dairyflow.modules.users.repository.PermissionRepository;
import com.dairyflow.modules.users.repository.RoleRepository;
import com.dairyflow.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Initializing baseline roles, permissions, and test accounts...");

        // 1. Ensure Permissions
        Map<String, PermissionEntity> permissions = initPermissions();

        // 2. Ensure Roles & Assign Permissions
        Map<String, RoleEntity> roles = initRoles(permissions);

        // 3. Ensure Default Users
        initUsers(roles);

        log.info("Data initialization complete. Default accounts ready for authentication.");
    }

    private Map<String, PermissionEntity> initPermissions() {
        Map<String, String[]> defs = new LinkedHashMap<>();
        defs.put("COW_READ", new String[]{"View cows and livestock details", "cows"});
        defs.put("COW_VIEW", new String[]{"View cow profiles, herd statistics, and telemetry", "cows"});
        defs.put("COW_WRITE", new String[]{"Register, update, and manage cows", "cows"});
        defs.put("COW_CREATE", new String[]{"Register new cattle in herd management", "cows"});
        defs.put("COW_UPDATE", new String[]{"Modify cattle attributes, status, and pen assignments", "cows"});
        defs.put("COW_DELETE", new String[]{"Archive or delete cow records", "cows"});

        defs.put("MILK_READ", new String[]{"View milk collection and yield logs", "milk"});
        defs.put("MILK_WRITE", new String[]{"Record morning/evening milk collection", "milk"});

        defs.put("HEALTH_READ", new String[]{"View health checkups, diagnoses, and treatments", "health"});
        defs.put("HEALTH_WRITE", new String[]{"Record treatments, prescriptions, and checkups", "health"});
        defs.put("VACCINATION_READ", new String[]{"View vaccination schedules and logs", "vaccinations"});
        defs.put("VACCINATION_WRITE", new String[]{"Schedule and record vaccinations", "vaccinations"});

        defs.put("BREEDING_READ", new String[]{"View heat cycles, inseminations, and calvings", "breeding"});
        defs.put("BREEDING_WRITE", new String[]{"Record AI, pregnancy checks, and calving", "breeding"});

        defs.put("FEED_READ", new String[]{"View feed rations and consumption logs", "feed"});
        defs.put("FEED_WRITE", new String[]{"Record daily feed intake and rations", "feed"});
        defs.put("INVENTORY_READ", new String[]{"View warehouse stock, feed, and medical supplies", "inventory"});
        defs.put("INVENTORY_WRITE", new String[]{"Manage inventory batches, stock levels, suppliers", "inventory"});

        defs.put("CUSTOMER_READ", new String[]{"View customer details and delivery addresses", "customers"});
        defs.put("CUSTOMER_WRITE", new String[]{"Create and modify customer profiles", "customers"});
        defs.put("ORDER_READ", new String[]{"View milk and dairy orders", "orders"});
        defs.put("ORDER_WRITE", new String[]{"Create, update, and cancel orders", "orders"});
        defs.put("DELIVERY_READ", new String[]{"View delivery routes and status", "deliveries"});
        defs.put("DELIVERY_WRITE", new String[]{"Assign and update delivery completion", "deliveries"});

        defs.put("FINANCE_READ", new String[]{"View revenue, expenses, and profit margins", "finance"});
        defs.put("FINANCE_WRITE", new String[]{"Record farm expenses and revenue vouchers", "finance"});
        defs.put("REPORTS_VIEW", new String[]{"Generate and export domain analytics reports", "reports"});

        defs.put("USER_MANAGE", new String[]{"Create, update, and manage system users and roles", "users"});
        defs.put("SYSTEM_CONFIG", new String[]{"Modify farm settings and system configurations", "settings"});

        Map<String, PermissionEntity> map = new HashMap<>();
        defs.forEach((name, meta) -> {
            PermissionEntity permission = permissionRepository.findByName(name)
                    .orElseGet(() -> permissionRepository.save(
                            PermissionEntity.builder()
                                    .name(name)
                                    .description(meta[0])
                                    .module(meta[1])
                                    .build()
                    ));
            map.put(name, permission);
        });

        return map;
    }

    private Map<String, RoleEntity> initRoles(Map<String, PermissionEntity> permissions) {
        Map<String, String> roleDefs = new LinkedHashMap<>();
        roleDefs.put("ROLE_OWNER", "Farm Owner with full administrative and business rights");
        roleDefs.put("ROLE_ADMIN", "System Administrator with technical management privileges");
        roleDefs.put("ROLE_MANAGER", "Farm Operations Manager managing day-to-day operations");
        roleDefs.put("ROLE_VETERINARIAN", "Veterinarian responsible for health, vaccinations, and breeding");
        roleDefs.put("ROLE_WORKER", "Farm Hand / Worker recording milk yields and feed intake");
        roleDefs.put("ROLE_DELIVERY_STAFF", "Logistics and delivery personnel fulfilling customer orders");
        roleDefs.put("ROLE_CUSTOMER", "Retail/Wholesale customer ordering milk and viewing subscriptions");

        Map<String, RoleEntity> map = new HashMap<>();

        roleDefs.forEach((roleName, desc) -> {
            RoleEntity role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(
                            RoleEntity.builder()
                                    .name(roleName)
                                    .description(desc)
                                    .permissions(new HashSet<>())
                                    .build()
                    ));

            // Assign permissions based on role
            Set<PermissionEntity> rolePerms = new HashSet<>();
            if ("ROLE_OWNER".equals(roleName) || "ROLE_ADMIN".equals(roleName)) {
                rolePerms.addAll(permissions.values());
            } else if ("ROLE_MANAGER".equals(roleName)) {
                List.of("COW_READ", "COW_VIEW", "COW_WRITE", "COW_CREATE", "COW_UPDATE",
                        "MILK_READ", "MILK_WRITE", "HEALTH_READ", "VACCINATION_READ", "BREEDING_READ",
                        "FEED_READ", "FEED_WRITE", "INVENTORY_READ", "INVENTORY_WRITE",
                        "CUSTOMER_READ", "CUSTOMER_WRITE", "ORDER_READ", "ORDER_WRITE",
                        "DELIVERY_READ", "DELIVERY_WRITE", "FINANCE_READ", "REPORTS_VIEW"
                ).forEach(p -> {
                    if (permissions.containsKey(p)) rolePerms.add(permissions.get(p));
                });
            } else if ("ROLE_VETERINARIAN".equals(roleName)) {
                List.of("COW_READ", "COW_VIEW", "COW_UPDATE", "HEALTH_READ", "HEALTH_WRITE",
                        "VACCINATION_READ", "VACCINATION_WRITE", "BREEDING_READ", "BREEDING_WRITE"
                ).forEach(p -> {
                    if (permissions.containsKey(p)) rolePerms.add(permissions.get(p));
                });
            } else if ("ROLE_WORKER".equals(roleName)) {
                List.of("COW_READ", "COW_VIEW", "MILK_READ", "MILK_WRITE",
                        "FEED_READ", "FEED_WRITE", "INVENTORY_READ"
                ).forEach(p -> {
                    if (permissions.containsKey(p)) rolePerms.add(permissions.get(p));
                });
            } else if ("ROLE_DELIVERY_STAFF".equals(roleName)) {
                List.of("ORDER_READ", "DELIVERY_READ", "DELIVERY_WRITE"
                ).forEach(p -> {
                    if (permissions.containsKey(p)) rolePerms.add(permissions.get(p));
                });
            } else if ("ROLE_CUSTOMER".equals(roleName)) {
                List.of("ORDER_READ", "ORDER_WRITE"
                ).forEach(p -> {
                    if (permissions.containsKey(p)) rolePerms.add(permissions.get(p));
                });
            }

            role.setPermissions(rolePerms);
            map.put(roleName, roleRepository.save(role));
        });

        return map;
    }

    private void initUsers(Map<String, RoleEntity> roles) {
        String defaultPasswordHash = passwordEncoder.encode("password");

        createTestUser("owner", "owner@dairyflow.com", defaultPasswordHash, "Elena", "Vance", "+15550101", roles.get("ROLE_OWNER"));
        createTestUser("admin", "admin@dairyflow.com", defaultPasswordHash, "Marcus", "Reed", "+15550102", roles.get("ROLE_ADMIN"));
        createTestUser("manager", "manager@dairyflow.com", defaultPasswordHash, "Sarah", "Jenkins", "+15550103", roles.get("ROLE_MANAGER"));
        createTestUser("vet", "vet@dairyflow.com", defaultPasswordHash, "David", "Evans", "+15550104", roles.get("ROLE_VETERINARIAN"));
        createTestUser("worker", "worker@dairyflow.com", defaultPasswordHash, "Tom", "Hanks", "+15550105", roles.get("ROLE_WORKER"));
        createTestUser("delivery", "delivery@dairyflow.com", defaultPasswordHash, "Leo", "Miller", "+15550106", roles.get("ROLE_DELIVERY_STAFF"));
        createTestUser("customer", "customer@dairyflow.com", defaultPasswordHash, "Alice", "Cooper", "+15550107", roles.get("ROLE_CUSTOMER"));
    }

    private void createTestUser(String username, String email, String passwordHash, String first, String last, String phone, RoleEntity role) {
        if (!userRepository.existsByUsername(username) && !userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .username(username)
                    .email(email)
                    .passwordHash(passwordHash)
                    .firstName(first)
                    .lastName(last)
                    .phoneNumber(phone)
                    .status("ACTIVE")
                    .roles(new HashSet<>(Collections.singletonList(role)))
                    .build();
            userRepository.save(user);
            log.info("Created test user: {} ({}) with role {}", username, email, role.getName());
        }
    }
}
