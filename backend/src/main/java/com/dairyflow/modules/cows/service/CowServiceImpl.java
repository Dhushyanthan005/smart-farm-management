package com.dairyflow.modules.cows.service;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.common.response.PageResponse;
import com.dairyflow.modules.cows.dto.CowResponse;
import com.dairyflow.modules.cows.dto.CreateCowRequest;
import com.dairyflow.modules.cows.dto.UpdateCowRequest;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.exception.CowNotFoundException;
import com.dairyflow.modules.cows.mapper.CowMapper;
import com.dairyflow.modules.cows.repository.CowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CowServiceImpl implements CowService {

    private final CowRepository cowRepository;
    private final CowMapper cowMapper;
    private final AuditService auditService;

    @Override
    @Transactional
    public CowResponse registerCow(CreateCowRequest request) {
        String normalizedTag = request.getTagNumber().trim().toUpperCase();
        if (cowRepository.existsByTagNumber(normalizedTag)) {
            throw new BadRequestException("Cow with tag number '" + normalizedTag + "' already exists", "DUPLICATE_TAG_NUMBER");
        }

        Cow cow = cowMapper.toEntity(request);
        Cow savedCow = cowRepository.save(cow);

        auditService.logAction("Cow", savedCow.getId().toString(), "COW_REGISTERED",
                null, "Registered cow with tag " + savedCow.getTagNumber(), null);

        log.info("Registered cow with id: {} and tag: {}", savedCow.getId(), savedCow.getTagNumber());
        return cowMapper.toResponse(savedCow);
    }

    @Override
    @Transactional(readOnly = true)
    public CowResponse getCowById(UUID id) {
        Cow cow = cowRepository.findById(id)
                .orElseThrow(() -> new CowNotFoundException("id", id));
        return cowMapper.toResponse(cow);
    }

    @Override
    @Transactional(readOnly = true)
    public CowResponse getCowByTagNumber(String tagNumber) {
        Cow cow = cowRepository.findByTagNumber(tagNumber.trim().toUpperCase())
                .orElseThrow(() -> new CowNotFoundException("tagNumber", tagNumber));
        return cowMapper.toResponse(cow);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CowResponse> listCows(int page, int size, String status) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Cow> cowPage;
        if (status != null && !status.isBlank()) {
            cowPage = cowRepository.findByStatus(status.toUpperCase(), pageRequest);
        } else {
            cowPage = cowRepository.findAll(pageRequest);
        }

        Page<CowResponse> responsePage = cowPage.map(cowMapper::toResponse);
        return PageResponse.from(responsePage);
    }

    @Override
    @Transactional
    public CowResponse updateCow(UUID id, UpdateCowRequest request) {
        Cow cow = cowRepository.findById(id)
                .orElseThrow(() -> new CowNotFoundException("id", id));

        cowMapper.updateEntityFromRequest(cow, request);
        Cow updatedCow = cowRepository.save(cow);

        auditService.logAction("Cow", id.toString(), "COW_UPDATED",
                null, "Updated cow details for tag " + updatedCow.getTagNumber(), null);

        log.info("Updated cow id: {}", id);
        return cowMapper.toResponse(updatedCow);
    }

    @Override
    @Transactional
    public void deleteCow(UUID id) {
        Cow cow = cowRepository.findById(id)
                .orElseThrow(() -> new CowNotFoundException("id", id));

        cowRepository.delete(cow);

        auditService.logAction("Cow", id.toString(), "COW_DELETED",
                null, "Deleted cow record for tag " + cow.getTagNumber(), null);

        log.info("Deleted cow id: {}", id);
    }
}
