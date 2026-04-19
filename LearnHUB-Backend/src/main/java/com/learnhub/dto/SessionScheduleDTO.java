package com.learnhub.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionScheduleDTO {
    private Long guideRequestId;
    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private String meetingLink;
}