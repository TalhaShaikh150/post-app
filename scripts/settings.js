import { userData } from "./dashboard.js";
import { client } from "../backend/backend.js";

// Global Variables
let profile = "";
let dummyProfile = "assets/profile-placeholder.png";
const avatarPreview = document.getElementById("avatar-preview");
let profileEmail = userData.user.user_metadata.email;
const removeProfileBtn = document.querySelector(".remove-profile");

const fullNameEl = document.getElementById("full-name");
const userNameEl = document.getElementById("userid");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const bio = document.getElementById('bio')
// Fetch Settings Data


function fetchSettingsData() {
  
  let editName = userData.user.user_metadata.displayName;
  let editEmail = userData.user.user_metadata.email;
  fullNameEl.value = editName;
  userNameEl.value = userData.user.id.slice(0,5)

  emailEl.value = editEmail;
  phoneEl.value = userData.user.user_metadata.phone;
}

// Profile Upload
function profileUpload() {
  const uploadBtn = document.querySelector(".profile-upload");
  const avatarUploadEl = document.getElementById("avatar-upload");

  uploadBtn.addEventListener("click", () => {
    avatarUploadEl.click();
  });

  avatarUploadEl.addEventListener("change", () => {
    profile = avatarUploadEl.files[0];
    avatarPreview.src = URL.createObjectURL(profile);
    removeProfileBtn.classList.remove("hide");
  });

  removeProfile(removeProfileBtn);
}

function removeProfile(removeProfileBtn) {
  removeProfileBtn.addEventListener("click", async () => {
    avatarPreview.src = dummyProfile;
    removeProfileBtn.classList.add("hide");

    await client.storage
      .from("snapProfile")
      .remove([`${profileEmail}/profile.jpg`]);
  });
}
async function saveChangesToDb() {
  const buttons = document.querySelector(".form-actions");
  const saveChangesBtn = document.querySelector(".save-changes");

  document.body.addEventListener("change", () => {
    buttons.classList.remove("hide");
  });

  saveChangesBtn.addEventListener("click", async () => {
    sendUserDataToDb()
  });
}

async function sendUserDataToDb(){
  // const { data,error } = await client
  // .from('snapData')

  // .insert({ email:emailEl.value,phone:phoneEl.value,fullName:fullNameEl.value,userId:userNameEl.value,Bio:bio.value})

  const { data, error } = client 
  .from('snapData')
  .upsert({email:emailEl.value,phone:phoneEl.value,fullName:fullNameEl.value,userId:userNameEl.value,Bio:bio.value})
  .select()
  if(data){
    console.log(data)
  }

  if(error){
    console.log(error,error.message)
  }
}


// Init
document.addEventListener("DOMContentLoaded", async () => {
  fetchSettingsData();
saveChangesToDb()
  profileUpload();
});
