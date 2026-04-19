package com.learnhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "guide_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuideSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "guide_request_id", nullable = false)
    private GuideRequest guideRequest;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 60; // Default 1 hour

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.SCHEDULED;

    @Column(length = 500)
    private String meetingLink;

    @Column(length = 2000)
    private String notes; // Notes from the session

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum SessionStatus {
        SCHEDULED,   // Session is scheduled
        IN_PROGRESS, // Session is ongoing
        COMPLETED,   // Session completed
        CANCELLED,   // Session cancelled
        NO_SHOW      // Student didn't show up
    }
}