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

// Logout button functionality
document.querySelector(".logout-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    alert("Logged out successfully!");
    // In a real app, you would redirect to login page
    // window.location.href = '/login';
  }
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

let userData = JSON.parse(
  localStorage.getItem("sb-oeuieksflauztarkxvsk-auth-token")
);

function userProfileData() {
  let userName = userData.user.user_metadata.displayName;
  let userEmail = userData.user.user_metadata.email;
  const userProfileContainer = document.querySelector(".user-profile");
  console.log(userProfileContainer);
  userProfileContainer.innerHTML = `<img src="assets/profile-placeholder.png" alt="Profile" class="profile-image">
            <div class="profile-info">
                <div class="profile-name">${userName}</div>
                <div class="profile-email">${userEmail}</div>
            </div>
            
              `;
}
document.addEventListener("DOMContentLoaded", ()=>{
  
  userProfileData();
  
})
