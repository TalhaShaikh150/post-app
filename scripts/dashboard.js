// ==============================
// Imports
// ==============================
import { client } from "../backend/backend.js";
import { darkMode } from "./extras.js";
dayjs.extend(window.dayjs_plugin_relativeTime);

// ==============================
// Global Variables
// ==============================
export let userData = JSON.parse(
  localStorage.getItem("sb-oeuieksflauztarkxvsk-auth-token")
);

let postFile;
let errorTimeout; // For error button timeout

// ==============================
// DOM Elements
// ==============================
const postPreview = document.querySelector(".post-preview");
const homeScreen = document.querySelector(".main-content");
const settingScreen = document.querySelector(".profile-settings");
const uploadPostEl = document.getElementById("post-upload-input");
const postText = document.querySelector(".post-input");
const uploadBtn = document.querySelector(".media-btn");

// ==============================
// Authentication
// ==============================
function getAuth() {
  let auth = JSON.parse(
    localStorage.getItem("sb-oeuieksflauztarkxvsk-auth-token")
  );
  if (!auth) window.location.href = "index.html";
}

// ==============================
// Profile
// ==============================
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

function logOut() {
  const logOutBtn = document.querySelector(".logout-btn");
  logOutBtn.addEventListener("click", () => {
    localStorage.removeItem("sb-oeuieksflauztarkxvsk-auth-token");
    window.location.href = "index.html";
  });
}

// ==============================
// Tabs & Navigation
// ==============================
function switchTab() {
  const allNavItems = document.querySelectorAll(".nav-item");

  allNavItems.forEach((element) => {
    element.addEventListener("click", () => {
      allNavItems.forEach((c) => c.classList.remove("active"));

      if (element.childNodes[1].classList.contains("fa-home")) {
        homeScreen.classList.remove("hide");
        settingScreen.classList.add("hide");
      }

      if (element.childNodes[1].classList.contains("fa-cog")) {
        settingScreen.classList.remove("hide");
        homeScreen.classList.add("hide");
      }

      element.classList.add("active");
    });
  });
}

// ==============================
// Post Menu Dropdown
// ==============================
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

  document.addEventListener("click", () => {
    document.querySelectorAll(".post-menu").forEach((menu) => {
      menu.classList.remove("active");
    });
  });
}

// ==============================
// Upload Post
// ==============================
function uploadPost() {
  uploadBtn.addEventListener("click", () => uploadPostEl.click());

  uploadPostEl.addEventListener("change", () => {
    postFile = uploadPostEl.files[0];
    postPreview.src = URL.createObjectURL(postFile);
  });
}

async function profileSrc() {
  const { data } = client.storage
    .from("snapPost")
    .getPublicUrl(`public/${postFile.name}`, {});
  return data;
}

// ==============================
// Post to Database
// ==============================
function postToDB() {
  const postBtn = document.querySelector(".post-btn");
  const errorBtn = document.querySelector(".btn-error");

  postBtn.addEventListener("click", async () => {
    if (!uploadPostEl.value || !postText.value) {
      errorBtn.classList.remove("none");
      clearTimeout(errorTimeout);
      errorTimeout = setTimeout(() => errorBtn.classList.add("none"), 1000);
      return;
    }

    postBtn.innerHTML = "Uploading....";

    const { data: uploadData, error: uploadError } = await client.storage
      .from("snapPost")
      .upload(`public/${postFile.name}`, postFile, {});

    if (uploadError) return console.error("Upload Error:", uploadError.message);

    if (uploadData) {
      postBtn.innerHTML = "Uploaded Successfully";
      setTimeout(() => (postBtn.innerHTML = "Create Post"), 500);

      const profile = await profileSrc();
      let profileUrl = profile.publicUrl;

      const { data, error } = await client.from("snapData").insert({
        email: userData.user.user_metadata.email,
        userName: userData.user.user_metadata.displayName,
        postSrc: profileUrl,
        postText: postText.value,
      });

      if (error) console.log(error.message);
      if (data) console.log(data);

      fetchPostData();
    }
  });
}

// ==============================
// Fetch & Render Posts
// ==============================
async function fetchPostData() {
  const { data, error } = await client.from("snapData").select();
  if (!data) return;

  const postFeedContainer = document.querySelector(".posts-feed");
  postFeedContainer.innerHTML = "";
  postText.value = "";

  data.forEach((element) => {
    let postTime = dayjs(element.created_at).fromNow();
    renderPost(element, postTime, data);
  });

  return data;
}

function renderPost(post, postTime, postIdArr) {
  const postFeedContainer = document.querySelector(".posts-feed");
  let html = `
    <div class="post-card">
      <div class="post-header">
        <img src="assets/profile-placeholder.png" alt="User" class="post-user-image none">
        <div class="avatar-container">
          <div class="profile-avatar">${post.userName[0]}</div>
          <div class="status-indicator none"></div>
        </div>
        <div class="post-user-info">
          <div class="post-user-name">${post.userName}</div>
          <div class="post-time">${postTime}</div>
        </div>
        <div class="post-menu">
          <button class="post-menu-btn"><i class="fas fa-ellipsis-h"></i></button>
        </div>
      </div>
      <div class="post-content">${post.postText}</div>
      <img src="${post.postSrc}" alt="Post image" class="post-image">
      <div class="post-footer">
        <div class="post-action like-btn">
          <i class="far fa-heart"></i>
          <span class="like-count"></span>
        </div>
        <a href="#" class="post-action">
          <i class="far fa-comment"></i><span>23</span>
        </a>
        <a href="#" class="post-action">
          <i class="far fa-share-square"></i><span>Share</span>
        </a>
      </div>
    </div>`;

  postFeedContainer.innerHTML += html;
  postPreview.src = "";

  likePost(postIdArr);
}

// ==============================
// Likes
// ==============================
async function likePost(postIdArr) {
  const likeBtn = document.querySelectorAll(".like-btn");
  const likeCountEl = document.querySelectorAll(".like-count");
  for (let index = 0; index < postIdArr.length; index++) {
    const postId = postIdArr[index].id; // Your post's id
    console.log(postId)
    let initialCount = 0;
    let userId = userData.user.id

    // 1. Fetch initial like count
    const { count } = await client
      .from("postLikes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    likeCountEl[index].innerText = count ?? 0;

    // 2. Check if THIS user already liked this post
    const { data: likedRows } = await client
      .from("postLikes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (likedRows.length > 0) {
      likeBtn[index].classList.add("liked"); // preload state
    }

    // 3. Add toggle functionality
    likeBtn[index].addEventListener("click", async () => {
      const { data: existing } = await client
        .from("postLikes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId);

      if (existing.length > 0) {
        // Unlike → delete
        await client.from("postLikes").delete().match({
          post_id: postId,
          user_id: userId,
        });
        likeBtn[index].classList.remove("liked");
      } else {
        // Like → insert
        await client.from("postLikes").insert([
          { post_id: postId, user_id: userId },
        ]);
        likeBtn[index].classList.add("liked");
      }

      // Refresh count from Supabase
      const { count: newCount } = await client
        .from("postLikes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      likeCountEl[index].innerText = newCount ?? 0;
    });
  }
}




// ==============================
// Init on Page Load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  getAuth();
  darkMode();
  switchTab();
  logOut();

  uploadPost();
  postToDB();
  initPostMenuDropdowns();

  profileDashboardData();
  fetchPostData();
});
