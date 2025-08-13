//Global Variables

export let userData = JSON.parse(
  localStorage.getItem("sb-oeuieksflauztarkxvsk-auth-token")
);

const homeScreen = document.querySelector(".main-content");
const settingScreen = document.querySelector(".profile-settings");

// Toggle post menu dropdown
document.querySelectorAll(".post-menu-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const menu = btn.closest(".post-menu");
    document.querySelectorAll(".post-menu").forEach((m) => {
      if (m !== menu) m.classList.remove("active");
    });
    menu.classList.toggle("active");
  });
});

// Close dropdowns when clicking elsewhere
document.addEventListener("click", () => {
  document.querySelectorAll(".post-menu").forEach((menu) => {
    menu.classList.remove("active");
  });
});

// Simulate post creation
document.querySelector(".post-btn").addEventListener("click", () => {
  const postInput = document.querySelector(".post-input");
  if (postInput.value.trim() !== "") {
    alert("Post created successfully!");
    postInput.value = "";
  } else {
    alert("Please write something to post!");
  }
});


function profileDashboardData() {
  let userName = userData.user.user_metadata.displayName;
  let userEmail = userData.user.user_metadata.email;
  const userProfileContainer = document.querySelector(".user-profile");
  userProfileContainer.innerHTML = `
  <img src="assets/profile-placeholder.png" alt="Profile" class="profile-image" />

<div class="profile-info">
  <div class="profile-name">${userName}</div>
  <div class="profile-email">${userEmail}</div>
</div>         
              `;
} 

function switchTab() {
  const allNavItems = document.querySelectorAll(".nav-item");
  allNavItems.forEach((element) => {
    element.addEventListener("click", () => {
      allNavItems.forEach((c) => {
        c.classList.remove("active");
      });

      let settingsTab = element.childNodes[1].classList.contains("fa-cog");

      let homeTab = element.childNodes[1].classList.contains("fa-home");

      if (homeTab) {
        homeScreen.classList.remove("hide");
        settingScreen.classList.add("hide");
      } 
       if (settingsTab) {
        settingScreen.classList.remove("hide");
        homeScreen.classList.add("hide");
      }

      element.classList.add("active");
    });
  });
}

function logOut() {
  const logOutBtn = document.querySelector(".logout-btn");
  logOutBtn.addEventListener("click", () => {
    window.location.href = "index.html";
    localStorage.clear();
  });
}

//On Page Load
document.addEventListener("DOMContentLoaded", () => {
  switchTab();
profileDashboardData()
  logOut();
});
