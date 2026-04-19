package com.learnhub.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long enrollmentId;
    private String paymentMethod; // CARD, UPI, NET_BANKING
    private Double amount;
}