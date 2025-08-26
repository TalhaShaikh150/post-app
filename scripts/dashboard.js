// Imports
import { client } from "../backend/backend.js";
import { darkMode } from "./extras.js";

// Global Variables
export let userData = JSON.parse(
  localStorage.getItem("sb-oeuieksflauztarkxvsk-auth-token")
);
const postPreview = document.querySelector(".post-preview");
dayjs.extend(window.dayjs_plugin_relativeTime);

let postFile;
// DOM Elements
const homeScreen = document.querySelector(".main-content");
const settingScreen = document.querySelector(".profile-settings");
const uploadPostEl = document.getElementById("post-upload-input");
const postText = document.querySelector(".post-input");
const uploadBtn = document.querySelector(".media-btn");

// UI Helpers

// Toggle post menu dropdown
function initPostMenuDropdowns() {
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
}

// Show profile data
function profileDashboardData() {
  let userName = userData.user.user_metadata.displayName;
  let userEmail = userData.user.user_metadata.email;
  let firstLetter = userName[0];
  const userProfileContainer = document.querySelector(".user-profile");
  userProfileContainer.innerHTML = `
    <img src="assets/profile-placeholder.png" alt="Profile" class="profile-image none" />
    
<div class="avatar-container">
        <div class="profile-avatar">${firstLetter}</div>
        <div class="status-indicator"></div>
    </div>
    <div class="profile-info">
      <div class="profile-name">${userName}</div>
      <div class="profile-email">${userEmail}</div>
    </div>
  `;
}

// Switch tabs (Home / Settings)
function switchTab() {
  const allNavItems = document.querySelectorAll(".nav-item");

  allNavItems.forEach((element) => {
    element.addEventListener("click", () => {
      allNavItems.forEach((c) => c.classList.remove("active"));

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

// Logout
function logOut() {
  const logOutBtn = document.querySelector(".logout-btn");
  logOutBtn.addEventListener("click", () => {
    window.location.href = "index.html";
    localStorage.removeItem("sb-oeuieksflauztarkxvsk-auth-token");
  });
}

// Handle post upload preview
function uploadPost() {
  uploadBtn.addEventListener("click", () => {
    uploadPostEl.click();

    uploadPostEl.addEventListener("change", async () => {
      postFile = uploadPostEl.files[0];
      const postUrl = URL.createObjectURL(postFile);
      postPreview.src = postUrl;
    });
  });
}

async function profileSrc() {
  const { data } = client.storage
    .from("snapPost")
    .getPublicUrl(`public/${postFile.name}`, {});
  return data;
}

function postToDB() {
  const postBtn = document.querySelector(".post-btn");
  const errorBtn = document.querySelector(".btn-error");
  let errorTimeout; // store timeout ID outside

  postBtn.addEventListener("click", async () => {
    postBtn.disabled = true;

    if (!uploadPostEl.value || !postText.value) {
      errorBtn.classList.remove("none");

      // clear any previous timeout before starting a new one
      clearTimeout(errorTimeout);

      errorTimeout = setTimeout(() => {
        errorBtn.classList.add("none");
        postBtn.disabled = false;
      }, 1000);

      return;
    }

    postBtn.innerHTML = "Uploading....";
    const { data: uploadData, error: uploadError } = await client.storage
      .from("snapPost")
      .upload(`public/${postFile.name}`, postFile, {});

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      return;
    }

    if (uploadData) {
      postBtn.innerHTML = "Uploaded Successfully";
      setTimeout(() => {
        postBtn.innerHTML = "Create Post";
      }, 300);
      const profile = await profileSrc();
      let profileUrl = profile.publicUrl;

      // Insert into DB
      const { data, error } = await client.from("snapData").insert({
        email: userData.user.user_metadata.email,
        userName: userData.user.user_metadata.displayName,
        postSrc: profileUrl,
        postText: postText.value,
      });

      if (data) {
        console.log(data);
      }
      if (error) {
        console.log(error, error.message);
      }
      fetchPostData();
    }
  });
}

async function fetchPostData() {
  const { data, error } = await client.from("snapData").select();

  if (data) {
    const postFeedContainer = document.querySelector(".posts-feed");
    postFeedContainer.innerHTML = "";
    const postData = data;
    postData.forEach((element) => {
      let postSrc = element.postSrc;
      let postText = element.postText;
      let userName = element.userName;
      let getTime = element.created_at;
      let postTime = dayjs(getTime).fromNow();

      console.log();

      renderPost(postSrc, postText, userName, postTime);
    });
  }
}

function renderPost(postSrc, postText, userName, postTime) {
  const postFeedContainer = document.querySelector(".posts-feed");
  let html = "";

  html += `<div class="post-card">
  
                <div class="post-header">
                    <img src="assets/profile-placeholder.png" alt="User" class="post-user-image">
                    <div class="post-user-info">
                        <div class="post-user-name">${userName}</div>
                        <div class="post-time">${postTime}</div>
                    </div>
                    <div class="post-menu">
                        <button class="post-menu-btn">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                </div>
                <div class="post-content">
                    ${postText}
                </div>
                <img src="${postSrc}" alt="Mountain view" class="post-image">
                
                <div class="post-footer">
                    <a href="#" class="post-action like-btn">
                        <i class="far fa-heart"></i>
                        <span>124</span>
                    </a>
                    <a href="#" class="post-action">
                        <i class="far fa-comment"></i>
                        <span>23</span>
                    </a>
                    <a href="#" class="post-action">
                        <i class="far fa-share-square"></i>
                        <span>Share</span>
                    </a>
                </div>
            </div>`;
  postFeedContainer.innerHTML += html;
  postPreview.src = "";
  postText = "";
}

function getAuth() {
  let auth = JSON.parse(
    localStorage.getItem("sb-oeuieksflauztarkxvsk-auth-token")
  );
  let pathName = window.location.pathname;

  if (auth) {
    if (pathName.endsWith("dashboard.html")) {
    }
  } else {
    window.location.href = "index.html";
  }
}
getAuth();

// ==============================
// Init on Page Load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  darkMode();
  uploadPost();
  initPostMenuDropdowns();
  postToDB();
  switchTab();
  profileDashboardData();
  fetchPostData();
  logOut();
});
