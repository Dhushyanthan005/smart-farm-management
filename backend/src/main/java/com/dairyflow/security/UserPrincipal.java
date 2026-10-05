package com.dairyflow.security;

import com.dairyflow.modules.users.entity.RoleEntity;
import com.dairyflow.modules.users.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Getter
@Builder
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final String username;
    private final String email;
    private final String firstName;
    private final String lastName;

    @JsonIgnore
    private final String password;

    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean active;

    public static UserPrincipal create(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        for (RoleEntity role : user.getRoles()) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
            if (role.getPermissions() != null) {
                role.getPermissions().forEach(p -> {
                    authorities.add(new SimpleGrantedAuthority(p.getName()));
                    // Ensure interchangeable aliases for cow permissions
                    if ("COW_READ".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("COW_VIEW"));
                    } else if ("COW_WRITE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("COW_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("COW_UPDATE"));
                    } else if ("COW_VIEW".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("COW_READ"));
                    } else if ("COW_CREATE".equalsIgnoreCase(p.getName()) || "COW_UPDATE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("COW_WRITE"));
                    }

                    // Ensure interchangeable aliases for milk permissions
                    if ("MILK_READ".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("MILK_VIEW"));
                    } else if ("MILK_WRITE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("MILK_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("MILK_UPDATE"));
                    } else if ("MILK_VIEW".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("MILK_READ"));
                    } else if ("MILK_CREATE".equalsIgnoreCase(p.getName()) || "MILK_UPDATE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("MILK_WRITE"));
                    }

                    // Ensure interchangeable aliases for health permissions
                    if ("HEALTH_READ".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("HEALTH_VIEW"));
                        authorities.add(new SimpleGrantedAuthority("TREATMENT_VIEW"));
                        authorities.add(new SimpleGrantedAuthority("QUARANTINE_VIEW"));
                        authorities.add(new SimpleGrantedAuthority("WITHDRAWAL_VIEW"));
                    } else if ("HEALTH_WRITE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("HEALTH_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("HEALTH_UPDATE"));
                        authorities.add(new SimpleGrantedAuthority("TREATMENT_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("TREATMENT_UPDATE"));
                        authorities.add(new SimpleGrantedAuthority("TREATMENT_COMPLETE"));
                        authorities.add(new SimpleGrantedAuthority("QUARANTINE_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("QUARANTINE_RELEASE"));
                    } else if ("HEALTH_VIEW".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("HEALTH_READ"));
                    } else if ("HEALTH_CREATE".equalsIgnoreCase(p.getName()) || "HEALTH_UPDATE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("HEALTH_WRITE"));
                    }

                    // Ensure interchangeable aliases for breeding permissions
                    if ("BREEDING_READ".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("BREEDING_VIEW"));
                        authorities.add(new SimpleGrantedAuthority("HEAT_VIEW"));
                        authorities.add(new SimpleGrantedAuthority("PREGNANCY_VIEW"));
                        authorities.add(new SimpleGrantedAuthority("CALVING_VIEW"));
                    } else if ("BREEDING_WRITE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("BREEDING_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("BREEDING_UPDATE"));
                        authorities.add(new SimpleGrantedAuthority("HEAT_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("HEAT_UPDATE"));
                        authorities.add(new SimpleGrantedAuthority("PREGNANCY_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("PREGNANCY_UPDATE"));
                        authorities.add(new SimpleGrantedAuthority("PREGNANCY_CONFIRM"));
                        authorities.add(new SimpleGrantedAuthority("CALVING_CREATE"));
                        authorities.add(new SimpleGrantedAuthority("CALVING_UPDATE"));
                    } else if ("BREEDING_VIEW".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("BREEDING_READ"));
                    } else if ("BREEDING_CREATE".equalsIgnoreCase(p.getName()) || "BREEDING_UPDATE".equalsIgnoreCase(p.getName())) {
                        authorities.add(new SimpleGrantedAuthority("BREEDING_WRITE"));
                    }
                });
            }
        }

        return UserPrincipal.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .active("ACTIVE".equalsIgnoreCase(user.getStatus()))
                .build();
    }

    public List<String> getRoles() {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .toList();
    }

    public List<String> getPermissions() {
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> !auth.startsWith("ROLE_"))
                .distinct()
                .toList();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    public String getFullName() {
        String first = firstName != null ? firstName.trim() : "";
        String last = lastName != null ? lastName.trim() : "";
        String full = (first + " " + last).trim();
        return full.isEmpty() ? username : full;
    }
}
