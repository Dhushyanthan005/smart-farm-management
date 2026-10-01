package com.dairyflow.modules.cows;

import com.dairyflow.common.audit.AuditService;
import com.dairyflow.common.exception.BadRequestException;
import com.dairyflow.modules.cows.dto.CreateCowRequest;
import com.dairyflow.modules.cows.dto.CowResponse;
import com.dairyflow.modules.cows.entity.Cow;
import com.dairyflow.modules.cows.mapper.CowMapper;
import com.dairyflow.modules.cows.repository.CowRepository;
import com.dairyflow.modules.cows.service.CowServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CowServiceTest {

    @Mock
    private CowRepository cowRepository;

    @Mock
    private CowMapper cowMapper;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private CowServiceImpl cowService;

    private CreateCowRequest sampleRequest;
    private Cow sampleCow;
    private CowResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleRequest = CreateCowRequest.builder()
                .tagNumber("DF-101")
                .name("Daisy")
                .breed("Holstein")
                .dateOfBirth(LocalDate.of(2023, 1, 15))
                .gender("FEMALE")
                .status("ACTIVE")
                .build();

        sampleCow = Cow.builder()
                .id(UUID.randomUUID())
                .tagNumber("DF-101")
                .name("Daisy")
                .breed("Holstein")
                .dateOfBirth(LocalDate.of(2023, 1, 15))
                .gender("FEMALE")
                .status("ACTIVE")
                .build();

        sampleResponse = CowResponse.builder()
                .id(sampleCow.getId())
                .tagNumber("DF-101")
                .name("Daisy")
                .breed("Holstein")
                .dateOfBirth(sampleCow.getDateOfBirth())
                .gender("FEMALE")
                .status("ACTIVE")
                .build();
    }

    @Test
    @DisplayName("Should register cow successfully when tag is unique")
    void shouldRegisterCowSuccessfully() {
        when(cowRepository.existsByTagNumber("DF-101")).thenReturn(false);
        when(cowMapper.toEntity(any(CreateCowRequest.class))).thenReturn(sampleCow);
        when(cowRepository.save(any(Cow.class))).thenReturn(sampleCow);
        when(cowMapper.toResponse(any(Cow.class))).thenReturn(sampleResponse);

        CowResponse result = cowService.registerCow(sampleRequest);

        assertThat(result).isNotNull();
        assertThat(result.getTagNumber()).isEqualTo("DF-101");
        assertThat(result.getName()).isEqualTo("Daisy");
        verify(cowRepository, times(1)).save(any(Cow.class));
        verify(auditService, times(1)).logAction(eq("Cow"), anyString(), eq("COW_REGISTERED"), isNull(), anyString(), isNull());
    }

    @Test
    @DisplayName("Should throw BadRequestException when tag number already exists")
    void shouldThrowWhenTagNumberDuplicate() {
        when(cowRepository.existsByTagNumber("DF-101")).thenReturn(true);

        assertThatThrownBy(() -> cowService.registerCow(sampleRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("already exists");

        verify(cowRepository, never()).save(any(Cow.class));
    }
}
