export function darkMode(){
  // Dark mode toggle functionality
  const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  // User previously selected dark
  document.body.classList.add("dark-mode");
  themeIcon.classList.replace("fa-moon", "fa-sun");
} else {
  // Default = light mode
  document.body.classList.remove("dark-mode");
  themeIcon.classList.replace("fa-sun", "fa-moon");
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  } else {
    localStorage.setItem("theme", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
  }
});
}


export function passwordToggle() {
  const passwordToggle = document.querySelectorAll(".password-toggle");

  passwordToggle.forEach((element) => {
    element.addEventListener("click", () => {
      element.classList.toggle("fa-eye");
      element.classList.toggle("fa-eye-slash");

      let passwordField = element.previousElementSibling;
      if (element.classList.contains("fa-eye-slash")) {
        passwordField.type = "text";
      } else {
        passwordField.type = "password";
      }
    });
  });
}


