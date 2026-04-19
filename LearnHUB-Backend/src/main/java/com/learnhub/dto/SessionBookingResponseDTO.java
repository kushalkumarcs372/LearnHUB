package com.learnhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionBookingResponseDTO {
    private Long guideRequestId;
    private Long paymentId;
    private String transactionId;
    private String status; // COMPLETED / FAILED
}

