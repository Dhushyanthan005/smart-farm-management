/**
 * DairyFlow Domain Modules (Modular Monolith Bounded Contexts).
 *
 * <p>Contains 19 isolated business domains:
 * <ul>
 *   <li>auth - Authentication, JWT, and session management</li>
 *   <li>users - User accounts, profiles, roles, and status</li>
 *   <li>cows - Livestock registration, herd profiles, lineage</li>
 *   <li>milk - Morning/evening collection, milk yields and quality</li>
 *   <li>health - Diagnoses, clinical treatments, vet records</li>
 *   <li>vaccinations - Vaccine schedules, dose tracking, due dates</li>
 *   <li>breeding - Heat cycles, artificial insemination, calving</li>
 *   <li>feed - Ration formulations, daily feed consumption</li>
 *   <li>inventory - Stock levels, warehouse medicines, equipment, reorders</li>
 *   <li>staff - Farm personnel, work shifts, attendance, roles</li>
 *   <li>customers - Retail and wholesale customer profiles, addresses</li>
 *   <li>subscriptions - Daily recurring milk deliveries, pause/resume</li>
 *   <li>orders - Customer purchase orders, items, lifecycle status</li>
 *   <li>deliveries - Route dispatching, dropoffs, agent assignment</li>
 *   <li>payments - Transaction records, cash/online settlement</li>
 *   <li>finance - Farm revenues, operational expenses, P&L</li>
 *   <li>notifications - In-app alerts, events, dispatch hooks</li>
 *   <li>reports - Aggregations, summaries, and document export</li>
 *   <li>dashboard - High-level KPIs, herd statistics, milk analytics</li>
 * </ul>
 */
package com.dairyflow.modules;
