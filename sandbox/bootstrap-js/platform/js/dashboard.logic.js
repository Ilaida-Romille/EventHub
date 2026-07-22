export function getMonthShortLabel(dateValue) {
   const date = new Date(dateValue);

   if (Number.isNaN(date.getTime())) {
      return null;
   }

   return new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC"
   }).format(date);
}

export function buildMonthlyEventsFromSource(events, year = new Date().getUTCFullYear()) {
   const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
   ];
   const counts = new Array(12).fill(0);

   (Array.isArray(events) ? events : []).forEach((event) => {
      const date = new Date(event?.date);

      if (Number.isNaN(date.getTime())) {
         return;
      }

      if (date.getUTCFullYear() !== Number(year)) {
         return;
      }

      counts[date.getUTCMonth()] += 1;
   });

   return {
      labels: monthLabels,
      counts
   };
}

export function normalizeMonthlySeries(monthlyEvents) {
   const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
   ];
   const byMonth = new Map(
      (Array.isArray(monthlyEvents) ? monthlyEvents : []).map((entry) => [entry.month, entry])
   );

   return {
      labels: monthLabels,
      counts: monthLabels.map((label) => Number(byMonth.get(label)?.count ?? 0))
   };
}
