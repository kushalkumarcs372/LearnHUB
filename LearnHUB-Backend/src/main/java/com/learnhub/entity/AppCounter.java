package com.learnhub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_counters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppCounter {

    @Id
    @Column(name = "counter_key", length = 100, nullable = false)
    private String key;

    @Column(name = "counter_value", nullable = false)
    private Long value = 0L;
}

