package com.dairyflow.modules.auth.service;

import com.dairyflow.modules.auth.dto.*;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(String refreshToken);

    UserProfileResponse getCurrentUser();

    void changePassword(ChangePasswordRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    AuthResponse register(RegisterRequest request);
}
