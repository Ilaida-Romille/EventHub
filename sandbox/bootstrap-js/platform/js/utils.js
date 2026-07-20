export function calculateInvoiceTotal(attendeeCount, ratePerAttendee) {
   const validRate = ratePerAttendee ?? 0;
   return attendeeCount * validRate;
}

export function formatCurrencyPHP(amount) {
   const formattedNumber = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
   }).format(amount);
   return formattedNumber;
}
