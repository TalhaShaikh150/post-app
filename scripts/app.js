//Global Variables
const errorMessage = document.querySelector(".error-message");
const statusMessage = document.querySelector(".status");

// Tab Switching
const tabs = document.querySelectorAll(".tab");
const authForms = document.querySelectorAll(".auth-form");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    statusMessage.classList.add("hide");
    errorMessage.classList.add("hide");
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
      } else {
        passwordField.type = "password";
      }
    });
  });
}

function addError() {
  errorMessage.classList.remove("hide");
  setTimeout(() => {
    errorMessage.classList.add("hide");
  }, 2400);
}

async function signUp() {
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const fullName = document.getElementById("register-name");
  const signUpForm = document.getElementById("register-form");
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = emailInput.value;
    let password = passwordInput.value;
    let name = fullName.value;
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: name,
        },
      },
    });

    if (data.user == null) {
      addError();
    } else {
      statusMessage.classList.remove("hide");
      statusMessage.innerHTML = "Account Created Sucessfully";
      setTimeout(() => {
        fullName.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        document.querySelector('.tab[data-tab="login"]').click();
      }, 1500);
    }

    if (error) {
      if (error.message) {
        statusMessage.classList.add("hide");

        addError();
        errorMessage.innerHTML = `${error.message}`;
        return;
      }
    }
  });
}

async function signIn() {
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = emailInput.value;
    let password = passwordInput.value;
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user == null) {
      addError();
      errorMessage.innerHTML = "Invalid Login Details";

      return;
    }
    if (data) {
      statusMessage.classList.remove("hide");
      statusMessage.innerHTML = "Login Successfully";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    }

    if (error) {
      console.log(error);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  signUp();
  signIn();
  passwordToggle();
});
