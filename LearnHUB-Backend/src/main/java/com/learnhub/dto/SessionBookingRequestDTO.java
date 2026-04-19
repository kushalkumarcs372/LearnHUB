package com.learnhub.dto;

import lombok.Data;

@Data
public class SessionBookingRequestDTO {
    private Long courseId;
    private Long instructorId;
    private String topic;
    private String description;

    // Simulated payment inputs
    private String paymentMethod; // CARD, UPI, NET_BANKING
    private Double amount;
}

