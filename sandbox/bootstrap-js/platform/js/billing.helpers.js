export function calculateInvoiceTotal(attendeeCount, ratePerAttendee) {
   const safeAttendeeCount = Number(attendeeCount ?? 0);
   const safeRate = Number(ratePerAttendee ?? 0);
   return safeAttendeeCount * safeRate;
}

export function formatCurrencyPHP(amount) {
   return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
   }).format(Number(amount ?? 0));
}
