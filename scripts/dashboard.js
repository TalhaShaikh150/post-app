// ==============================
// Imports
// ==============================
import { client } from "../backend/backend.js";

// ==============================
// Global Variables
// ==============================
export let userData = JSON.parse(
  localStorage.getItem("sb-oeuieksflauztarkxvsk-auth-token")
);

let postFile;
// ==============================
// DOM Elements
// ==============================
const homeScreen = document.querySelector(".main-content");
const settingScreen = document.querySelector(".profile-settings");
const uploadPostEl = document.getElementById("post-upload-input");
const postText = document.querySelector(".post-input");
const uploadBtn = document.querySelector(".media-btn");

// ==============================
// UI Helpers
// ==============================

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

  const userProfileContainer = document.querySelector(".user-profile");
  userProfileContainer.innerHTML = `
    <img src="assets/profile-placeholder.png" alt="Profile" class="profile-image" />
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
    localStorage.clear();
  });
}

// ==============================
// Post Upload & Database
// ==============================

// Handle post upload preview
function uploadPost() {
  uploadBtn.addEventListener("click", () => {
    uploadPostEl.click();
    const postPreview = document.querySelector(".post-preview");

    uploadPostEl.addEventListener("change", async () => {
      postFile = uploadPostEl.files[0];
      const postUrl = URL.createObjectURL(postFile);
      postPreview.src = postUrl;
    });
  });
}

// Get public URL for uploaded file
async function profileSrc() {
  const { data } = client.storage
    .from("snapPost")
    .getPublicUrl(`public/${postFile.name}`, {});
  return data;
}

// Upload post to database
function postToDB() {
  const postBtn = document.querySelector(".post-btn");

  postBtn.addEventListener("click", async () => {
    if (!uploadPostEl.value || !postText.value) {
      alert("Please Add Image And Post ");
      return;
    }

    // Save file to Supabase bucket
    const { data: uploadData, error: uploadError } = await client.storage
      .from("snapPost")
      .upload(`public/${postFile.name}`, postFile, {});

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      return;
    }

    if (uploadData) {
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
    postFeedContainer.innerHTML = ""; // 🧹 clear old posts first
    const postData = data;
    postData.forEach((element) => {
      let postSrc = element.postSrc;
      let postText = element.postText;
      let userName = element.userName;
      renderPost(postSrc, postText, userName);
    });
  }
}

function renderPost(postSrc, postText, userName) {
  const postFeedContainer = document.querySelector(".posts-feed");
  
  let html = "";

  html += `<div class="post-card">
          <div class="post-header">
            <img
              src="assets/profile-placeholder.png"
              alt="User"
              class="post-user-image"
            />
            <div class="post-user-info">
              <div class="post-user-name">${userName}</div>
              <div class="post-time">2 hours ago</div>
            </div>
            <div class="post-menu">
              <button class="post-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="post-menu-dropdown">
                <a href="#" class="post-menu-item">
                  <i class="fas fa-edit"></i>
                  <span>Edit Post</span>
                </a>
                <a href="#" class="post-menu-item">
                  <i class="fas fa-trash"></i>
                  <span>Delete Post</span>
                </a>
                <a href="#" class="post-menu-item">
                  <i class="fas fa-share"></i>
                  <span>Share Post</span>
                </a>
              </div>
            </div>
          </div>
          <div class="post-content">
            ${postText}
          </div>
          <img
            src="${postSrc}"
            alt="Post image"
            class="post-image"
          />
          <div class="post-actions">
            <a href="#" class="post-action">
              <i class="fas fa-thumbs-up"></i>
              <span>Like</span>
            </a>
            <a href="#" class="post-action">
              <i class="fas fa-comment"></i>
              <span>Comment</span>
            </a>
            <a href="#" class="post-action">
              <i class="fas fa-share"></i>
              <span>Share</span>
            </a>
          </div>
        </div>`;

  postFeedContainer.innerHTML += html;
}

// ==============================
// Init on Page Load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  uploadPost();
  initPostMenuDropdowns();
  postToDB();
  switchTab();
  profileDashboardData();
  fetchPostData();
  logOut();
});
