package com.learnhub.controller;

import com.learnhub.dto.PublicRatingDTO;
import com.learnhub.dto.PublicStatsDTO;
import com.learnhub.entity.AppRating;
import com.learnhub.repository.AppRatingRepository;
import com.learnhub.service.PublicStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicStatsController {

    @Autowired
    private PublicStatsService publicStatsService;

    @Autowired
    private AppRatingRepository appRatingRepository;

    @GetMapping("/stats")
    public ResponseEntity<PublicStatsDTO> getPublicStats() {
        return ResponseEntity.ok(publicStatsService.getPublicStats());
    }

    @GetMapping("/ratings/recent")
    public ResponseEntity<List<PublicRatingDTO>> getRecentRatings(
            @RequestParam(value = "limit", defaultValue = "3") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 10));
        List<AppRating> ratings = appRatingRepository.findRecentWithComment(PageRequest.of(0, safeLimit));
        List<PublicRatingDTO> dto = ratings.stream()
                .map(r -> new PublicRatingDTO(
                        r.getUser() != null ? r.getUser().getName() : "User",
                        r.getRating(),
                        r.getComment(),
                        r.getRecommend(),
                        r.getEaseOfUse(),
                        r.getContentQuality(),
                        r.getUpdatedAt()
                ))
                .toList();
        return ResponseEntity.ok(dto);
    }
}
