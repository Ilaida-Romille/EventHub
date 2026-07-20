import { isLikelyValidEmail } from "./email-format.js";

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
            target = "../platform/dashboard.html";
         } else if (email === "admin@company.com") {
            target = "../organizer/dashboard.html";
         } else if (email.endsWith("@company.com")) {
            target = "../users/upcoming-events.html";
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
