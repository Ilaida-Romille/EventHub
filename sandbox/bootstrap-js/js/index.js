function isLikelyValidEmail(str) {
   if (typeof str !== "string") return false;

   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

   return emailRegex.test(str.trim());
}

(function () {
   const form = document.getElementById("login-form");
   const emailInput = document.getElementById("email");
   const passwordInput = document.getElementById("password");

   if (!form || !emailInput || !passwordInput) return;

   emailInput.addEventListener("input", function () {
      emailInput.setCustomValidity("");
   });

   form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const rawEmail = emailInput.value;
      const email = rawEmail.trim().toLowerCase();
      let target = null;

      if (!isLikelyValidEmail(rawEmail)) {
         emailInput.setCustomValidity("invalid");
      } else if (emailInput.validity.valid) {
         if (email.endsWith("@eventhub.com")) {
            target = "platform/dashboard.html";
         } else if (email === "admin@company.com") {
            target = "organizer/dashboard.html";
         } else if (email.endsWith("@company.com")) {
            target = "users/upcoming-events.html";
         } else {
            emailInput.setCustomValidity("invalid");
         }
      }

      form.classList.add("was-validated");

      const emailOk = emailInput.validity.valid;
      const passwordOk = passwordInput.validity.valid;

      if (emailOk && passwordOk && target) {
         window.location.href = target;
      }
   });
})();

// TESTING LOGIC
function runEmailTests() {
   let passed = 0;
   let failed = 0;

   function assert(testName, actual, expected) {
      if (actual === expected) {
         passed++;
         console.log(`PASSED: ${testName}`);
      } else {
         failed++;
         console.error(`[X] FAILED: ${testName}\n   Expected: ${expected}\n   Got:      ${actual}`);
      }
   }

   console.log("=== RUNNING EMAIL VALIDATION TESTS ===");

   // --- Happy Path Tests ---
   assert("Accepts standard corporate email", isLikelyValidEmail("john@company.com"), true);
   assert("Accepts platform domain email", isLikelyValidEmail("admin@eventhub.com"), true);
   assert(
      "Accepts complex tags and subdomains",
      isLikelyValidEmail("user.name+tag@sub.domain.org"),
      true
   );
   assert(
      "Trims surrounding whitespace automatically",
      isLikelyValidEmail("   spaces_trimmed@domain.com  "),
      true
   );

   // --- Edge Cases / Failure Mode Tests  ---
   assert("Rejects plain text without symbols", isLikelyValidEmail("plain-text"), false);
   assert("Rejects email missing local part", isLikelyValidEmail("@missing-local.com"), false);
   assert(
      "Rejects email missing domain identifier",
      isLikelyValidEmail("missing-domain@.com"),
      false
   );
   assert(
      "Rejects emails containing multiple @ signs",
      isLikelyValidEmail("two@@signs.com"),
      false
   );
   assert(
      "Rejects explicit internal whitespace characters",
      isLikelyValidEmail("spaces in@email.com"),
      false
   );
   assert(
      "Rejects top-level domains under 2 letters",
      isLikelyValidEmail("bad-tld@domain.c"),
      false
   );

   // --- Type Safety Tests (Should return false) ---
   assert("Handles empty string entries safely", isLikelyValidEmail(""), false);
   assert("Handles absolute null types safely", isLikelyValidEmail(null), false);
   assert("Handles undefined parameter fields safely", isLikelyValidEmail(undefined), false);

   console.log(`\n=== TEST RESULTS ===`);
   console.log(`Passed: ${passed}`);
   if (failed > 0) {
      console.error(`Failed: ${failed}`);
   } else {
      console.log("All tests passed");
   }
}

runEmailTests();
