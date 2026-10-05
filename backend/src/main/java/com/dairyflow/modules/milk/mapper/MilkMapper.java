package com.dairyflow.modules.milk.mapper;

import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.milk.dto.CreateMilkRecordRequest;
import com.dairyflow.modules.milk.dto.MilkRecordResponse;
import com.dairyflow.modules.milk.dto.UpdateMilkRecordRequest;
import com.dairyflow.modules.milk.entity.MilkProductionRecord;
import com.dairyflow.modules.milk.entity.enums.MilkRecordStatus;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class MilkMapper {

    public MilkProductionRecord toEntity(CreateMilkRecordRequest request, Cow cow, UUID operatorId, String operatorName) {
        if (request == null || cow == null) {
            return null;
        }

        return MilkProductionRecord.builder()
                .cow(cow)
                .productionDate(request.getProductionDate())
                .shift(request.getShift())
                .quantityLiters(request.getQuantityLiters())
                .status(request.getStatus() != null ? request.getStatus() : MilkRecordStatus.BULK)
                .fatPercentage(request.getFatPercentage())
                .proteinPercentage(request.getProteinPercentage())
                .somaticCellCount(request.getSomaticCellCount())
                .conductivity(request.getConductivity())
                .operatorId(operatorId)
                .operatorName(operatorName)
                .notes(request.getNotes() != null ? request.getNotes().trim() : null)
                .build();
    }

    public MilkRecordResponse toResponse(MilkProductionRecord record) {
        if (record == null) {
            return null;
        }

        Cow cow = record.getCow();

        return MilkRecordResponse.builder()
                .id(record.getId())
                .cowId(cow != null ? cow.getId() : null)
                .cowTagNumber(cow != null ? cow.getTagNumber() : null)
                .cowName(cow != null ? cow.getName() : null)
                .pen(cow != null ? cow.getPen() : null)
                .productionDate(record.getProductionDate())
                .shift(record.getShift())
                .quantityLiters(record.getQuantityLiters())
                .status(record.getStatus())
                .fatPercentage(record.getFatPercentage())
                .proteinPercentage(record.getProteinPercentage())
                .somaticCellCount(record.getSomaticCellCount())
                .conductivity(record.getConductivity())
                .operatorId(record.getOperatorId())
                .operatorName(record.getOperatorName())
                .notes(record.getNotes())
                .createdAt(record.getCreatedAt())
                .updatedAt(record.getUpdatedAt())
                .createdBy(record.getCreatedBy())
                .updatedBy(record.getUpdatedBy())
                .build();
    }

    public void updateEntityFromRequest(MilkProductionRecord record, UpdateMilkRecordRequest request) {
        if (record == null || request == null) {
            return;
        }

        if (request.getQuantityLiters() != null) {
            record.setQuantityLiters(request.getQuantityLiters());
        }
        if (request.getStatus() != null) {
            record.setStatus(request.getStatus());
        }
        if (request.getFatPercentage() != null) {
            record.setFatPercentage(request.getFatPercentage());
        }
        if (request.getProteinPercentage() != null) {
            record.setProteinPercentage(request.getProteinPercentage());
        }
        if (request.getSomaticCellCount() != null) {
            record.setSomaticCellCount(request.getSomaticCellCount());
        }
        if (request.getConductivity() != null) {
            record.setConductivity(request.getConductivity());
        }
        if (request.getNotes() != null) {
            record.setNotes(request.getNotes().trim());
        }
    }
}
