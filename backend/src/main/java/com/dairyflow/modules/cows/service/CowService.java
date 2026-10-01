package com.dairyflow.modules.cows.service;

import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.cows.dto.CowResponse;
import com.dairyflow.modules.cows.dto.CreateCowRequest;
import com.dairyflow.modules.cows.dto.UpdateCowRequest;

import java.util.UUID;

public interface CowService {

    CowResponse registerCow(CreateCowRequest request);

    CowResponse getCowById(UUID id);

    CowResponse getCowByTagNumber(String tagNumber);

    PageResponse<CowResponse> listCows(int page, int size, String status);

    CowResponse updateCow(UUID id, UpdateCowRequest request);

    void deleteCow(UUID id);
}
