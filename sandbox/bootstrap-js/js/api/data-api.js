import { fetchJson } from "./client.js";
import { API_ENDPOINTS } from "./endpoints.js";

export function getPlatformDashboardData() {
   return fetchJson(API_ENDPOINTS.platform.dashboard);
}

export function getPlatformOrganizersData() {
   return fetchJson(API_ENDPOINTS.platform.organizers);
}

export function getPlatformBillingData() {
   return fetchJson(API_ENDPOINTS.platform.billing);
}

export function getPlatformTicketsData() {
   return fetchJson(API_ENDPOINTS.platform.tickets);
}

export function getUsersUpcomingEventsData() {
   return fetchJson(API_ENDPOINTS.users.upcomingEvents);
}

export function getUsersEventDetailsData() {
   return fetchJson(API_ENDPOINTS.users.eventDetails);
}

export function getPlatformOrganizersPayload() {
   return Promise.all([getPlatformOrganizersData(), getUsersUpcomingEventsData()]);
}

export function getPlatformBillingPayload() {
   return Promise.all([
      getPlatformBillingData(),
      getPlatformOrganizersData(),
      getUsersUpcomingEventsData()
   ]);
}

export function getPlatformTicketsPayload() {
   return Promise.all([getPlatformTicketsData(), getPlatformOrganizersData()]);
}

export function getUsersEventDetailsPayload() {
   return Promise.all([getUsersEventDetailsData(), getUsersUpcomingEventsData()]);
}

export function getUsersUpcomingEventsPayload() {
   return Promise.all([getUsersUpcomingEventsData(), getPlatformOrganizersData()]);
}
