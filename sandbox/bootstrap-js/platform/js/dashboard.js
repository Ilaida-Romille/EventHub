import { getPlatformDashboardData } from "../../js/api/data-api.js";

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

function renderMonthlyBars(monthlyEvents) {
   const chart = document.getElementById("events-bar-chart");

   if (!chart) {
      return;
   }

   chart.replaceChildren();

   monthlyEvents.forEach((entry) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${Math.max(0, Math.min(100, Number(entry.percent ?? 0)))}%`;
      bar.title = entry.month ?? "";
      chart.appendChild(bar);
   });
}

document.addEventListener("DOMContentLoaded", async () => {
   const chart = document.getElementById("events-bar-chart");

   if (chart) {
      chart.setAttribute("aria-busy", "true");
   }

   try {
      const data = await getPlatformDashboardData();

      renderKpis(data.kpis ?? {});
      renderMonthlyBars(data.monthlyEvents ?? []);
   } catch (error) {
      console.error("Failed to load dashboard data.", error);
   } finally {
      if (chart) {
         chart.setAttribute("aria-busy", "false");
      }
   }
});
