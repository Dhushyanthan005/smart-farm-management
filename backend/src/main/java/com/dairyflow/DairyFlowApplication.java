package com.dairyflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class DairyFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(DairyFlowApplication.class, args);
    }
}
