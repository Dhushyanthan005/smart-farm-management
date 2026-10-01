package com.dairyflow.infrastructure.scheduling;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class ScheduledJobConfig {
    // Scheduled tasks (vaccinations due, low stock alerts, subscription billing)
    // will be scheduled cleanly in domain modules using Spring's TaskScheduler.
}
