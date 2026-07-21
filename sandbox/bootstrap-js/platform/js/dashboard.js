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

   chart.innerHTML = "";

   monthlyEvents.forEach((entry) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${Math.max(0, Math.min(100, Number(entry.percent ?? 0)))}%`;
      bar.title = entry.month ?? "";
      chart.appendChild(bar);
   });
}

document.addEventListener("DOMContentLoaded", async () => {
   try {
      const response = await fetch("./data/dashboard-data.json");
      const data = await response.json();

      renderKpis(data.kpis ?? {});
      renderMonthlyBars(data.monthlyEvents ?? []);
   } catch (error) {
      console.error("Failed to load dashboard data.", error);
   }
});
