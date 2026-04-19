package com.learnhub.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

/**
 * Fixes MySQL "Data truncated for column 'payment_type'" errors when the DB schema
 * was created with an older enum definition (missing newer enum values like GUIDE_SESSION).
 *
 * We migrate the column away from a native MySQL ENUM to a VARCHAR so future enum additions
 * don't require DB-side enum alterations.
 */
@Component
public class PaymentsSchemaMigration implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(PaymentsSchemaMigration.class);

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    public PaymentsSchemaMigration(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        String databaseProductName = getDatabaseProductName();
        if (databaseProductName == null) {
            return;
        }

        String product = databaseProductName.toLowerCase();
        if (!product.contains("mysql") && !product.contains("mariadb")) {
            return;
        }

        try {
            String columnType = jdbcTemplate.queryForObject(
                    """
                            SELECT COLUMN_TYPE
                            FROM INFORMATION_SCHEMA.COLUMNS
                            WHERE TABLE_SCHEMA = DATABASE()
                              AND TABLE_NAME = 'payments'
                              AND COLUMN_NAME = 'payment_type'
                            """,
                    String.class
            );

            if (columnType == null) {
                return;
            }

            String normalized = columnType.trim().toLowerCase();
            if (normalized.startsWith("enum(")) {
                jdbcTemplate.execute("ALTER TABLE payments MODIFY payment_type VARCHAR(32) NOT NULL");
                log.info("Migrated payments.payment_type from ENUM to VARCHAR(32) to support new PaymentType values.");
            }
        } catch (Exception ex) {
            // Best-effort migration: ignore if the table doesn't exist yet or permissions are missing.
            log.debug("Skipping payments.payment_type migration: {}", ex.getMessage());
        }
    }

    private String getDatabaseProductName() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.getMetaData().getDatabaseProductName();
        } catch (Exception ex) {
            log.debug("Unable to determine database product: {}", ex.getMessage());
            return null;
        }
    }
}

