const supabaseUrl = "https://oeuieksflauztarkxvsk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldWlla3NmbGF1enRhcmt4dnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDgxMjAsImV4cCI6MjA2ODgyNDEyMH0.RrgmHluBL_jpYv0tRs2XMM7fAtuFD7w1RmmH6E-if9c";

const client = supabase.createClient(supabaseUrl, supabaseKey);

console.log(client);

// Tab Switching
const tabs = document.querySelectorAll(".tab");
const authForms = document.querySelectorAll(".auth-form");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs and forms
    tabs.forEach((t) => t.classList.remove("active"));
    authForms.forEach((form) => form.classList.remove("active"));

    // Add active class to clicked tab and corresponding form
    tab.classList.add("active");
    const tabName = tab.getAttribute("data-tab");
    document.getElementById(`${tabName}-form`).classList.add("active");
  });
});

// Switch between login and register links
document.getElementById("switch-to-register").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector('.tab[data-tab="register"]').click();
});

document.getElementById("switch-to-login").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector('.tab[data-tab="login"]').click();
});



function passwordToggle() {
  const passwordToggle = document.querySelectorAll(".password-toggle");

  passwordToggle.forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.toggle("fa-eye");
      element.classList.toggle("fa-eye-slash");

      let passwordField = element.previousElementSibling;
      if (element.classList.contains("fa-eye-slash")) {
        passwordField.type = "text";
      }
      else{
        passwordField.type = "password";
      }
    });
  });
}

passwordToggle();
