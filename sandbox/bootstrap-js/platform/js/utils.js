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

function runInvoiceTests() {
   let passed = 0;
   let failed = 0;

   function assert(testName, actual, expected) {
      if (actual === expected) {
         passed++;
         console.log(`PASSED: ${testName}`);
      } else {
         failed++;
         console.error(
            `[X] FAILED: ${testName}\n   Expected: "${expected}"\n   Got:      "${actual}"`
         );
      }
   }

   console.log("=== RUNNING INVOICE TOTAL TESTS ===");

   assert("Handles missing rate gracefully", calculateInvoiceTotal(15), 0);
   assert("Calculates total with small rate", calculateInvoiceTotal(155, 1), 155);
   assert("Calculates basic multiplication", calculateInvoiceTotal(200, 2), 400);
   assert("Calculates standard totals", calculateInvoiceTotal(20, 20), 400);
   assert("Handles zero attendees", calculateInvoiceTotal(0, 150), 0);

   console.log("\n=== RUNNING CURRENCY FORMATTING TESTS ===");

   assert("Formats zero", formatCurrencyPHP(0), "\u20b10.00");
   assert("Formats integer values", formatCurrencyPHP(20), "\u20b120.00");
   assert("Formats basic decimals", formatCurrencyPHP(20.99), "\u20b120.99");
   assert("Rounds repeating decimals up", formatCurrencyPHP(20.99999), "\u20b121.00");
   assert("Truncates insignificant decimals", formatCurrencyPHP(20.0001), "\u20b120.00");
   assert("Rounds midpoints up", formatCurrencyPHP(20.095), "\u20b120.10");

   console.log(`\n=== TEST RESULTS ===`);
   console.log(`Passed: ${passed}`);
   if (failed > 0) {
      console.error(`Failed: ${failed}`);
   } else {
      console.log("All tests passed");
   }
}

runInvoiceTests();
