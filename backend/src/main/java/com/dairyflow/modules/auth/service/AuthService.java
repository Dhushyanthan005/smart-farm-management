package com.dairyflow.modules.auth.service;

import com.dairyflow.modules.auth.dto.AuthResponse;
import com.dairyflow.modules.auth.dto.LoginRequest;
import com.dairyflow.modules.auth.dto.RefreshTokenRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);
}
