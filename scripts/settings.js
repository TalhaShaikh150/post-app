import { userData } from "./dashboard.js";
function fetch() {
  const fullNameEl = document.getElementById("full-name");
  const userNameEl = document.getElementById("username");
  const emailEl = document.getElementById('email')
  const phoneEl = document.getElementById('phone')

  let editName = userData.user.user_metadata.displayName;
  let editEmail = userData.user.user_metadata.email

  fullNameEl.value = editName;
  userNameEl.value = editName.toLowerCase();
  emailEl.value = editEmail
  phoneEl.value = userData.user.user_metadata.phone
}
fetch();
