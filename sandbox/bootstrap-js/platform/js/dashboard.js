import Chart from "chart.js/auto";
import { getPlatformDashboardPayload } from "../../js/api/data-api.js";
import { buildDashboardKpis, buildMonthlyEventsFromSource } from "./dashboard.logic.js";

let monthlyEventsChart = null;

function renderKpis(kpis) {
   const organizersEl = document.getElementById("kpi-total-organizers");
   const eventsEl = document.getElementById("kpi-total-events");

   if (organizersEl) {
      organizersEl.textContent = Number(kpis.totalOrganizers ?? 0).toLocaleString();
   }

   if (eventsEl) {
      eventsEl.textContent = Number(kpis.totalEventsThisYear ?? 0).toLocaleString();
   }
}

function renderMonthlyChart(labels, counts) {
   const canvas = document.getElementById("events-bar-chart");

   if (!canvas) {
      return;
   }

   const context = canvas.getContext("2d");

   if (!context) {
      return;
   }

   if (monthlyEventsChart) {
      monthlyEventsChart.destroy();
   }

   monthlyEventsChart = new Chart(context, {
      type: "bar",
      data: {
         labels,
         datasets: [
            {
               label: "Events",
               data: counts,
               borderRadius: 8,
               backgroundColor: "rgba(99, 102, 241, 0.75)",
               borderColor: "rgba(165, 180, 252, 1)",
               borderWidth: 1
            }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               labels: {
                  color: "#cbd5e1"
               }
            }
         },
         scales: {
            x: {
               ticks: {
                  color: "#94a3b8"
               },
               grid: {
                  color: "rgba(148, 163, 184, 0.15)"
               }
            },
            y: {
               beginAtZero: true,
               ticks: {
                  precision: 0,
                  color: "#94a3b8"
               },
               grid: {
                  color: "rgba(148, 163, 184, 0.15)"
               }
            }
         }
      }
   });
}

function setDashboardLoading(isLoading) {
   const chart = document.getElementById("events-bar-chart");

   if (chart) {
      chart.setAttribute("aria-busy", String(isLoading));
   }
}

document.addEventListener("DOMContentLoaded", async () => {
   setDashboardLoading(true);

   try {
      const [_dashboardData, upcomingEventsData, organizersData] =
         await getPlatformDashboardPayload();

      const year = new Date().getUTCFullYear();
      const computedKpis = buildDashboardKpis(organizersData, upcomingEventsData?.events, year);
      const monthlyEvents = buildMonthlyEventsFromSource(upcomingEventsData?.events, year);

      renderKpis(computedKpis);
      renderMonthlyChart(monthlyEvents.labels, monthlyEvents.counts);
   } catch (error) {
      console.error("Failed to load dashboard data.", error);
   } finally {
      setDashboardLoading(false);
   }
});
