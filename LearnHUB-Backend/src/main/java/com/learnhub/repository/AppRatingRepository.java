package com.learnhub.repository;

import com.learnhub.entity.AppRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppRatingRepository extends JpaRepository<AppRating, Long> {
    Optional<AppRating> findByUserId(Long userId);

    @Query("select avg(r.rating) from AppRating r")
    Double getAverageRating();

    @Query("select r from AppRating r join fetch r.user u where r.comment is not null and trim(r.comment) <> '' order by r.updatedAt desc")
    List<AppRating> findRecentWithComment(Pageable pageable);
}
