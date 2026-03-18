package com.uicode.postit.postitserver.test.config;

import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.postgresql.PostgreSQLContainer;

//@TestConfiguration(proxyBeanMethods = false)
public class TestContainersConfig {

    @Bean
    @ServiceConnection
    @SuppressWarnings("resource")
    PostgreSQLContainer postgresContainer() {
        return new PostgreSQLContainer("postgres:18-alpine")
            .withDatabaseName("postit_db")
            .withUsername("postittest")
            .withPassword("postittest");
    }

}
