package com.learnhub.dto;

import com.learnhub.entity.GuideRequest.RequestStatus;
import lombok.Data;

@Data
public class GuideResponseDTO {
    private Long requestId;
    private RequestStatus status;
    private String instructorResponse;
}