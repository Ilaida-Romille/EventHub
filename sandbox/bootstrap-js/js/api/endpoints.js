export const API_ENDPOINTS = Object.freeze({
   platform: Object.freeze({
      dashboard: "/platform/data/dashboard-data.json",
      organizers: "/platform/data/organizers-data.json",
      billing: "/platform/data/billing-data.json",
      tickets: "/platform/data/tickets-data.json"
   }),
   users: Object.freeze({
      upcomingEvents: "/users/data/upcoming-events-data.json",
      eventDetails: "/users/data/event-details-data.json"
   })
});
