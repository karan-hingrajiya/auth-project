const token = localStorage.getItem("accessToken");
const toastWrap = document.querySelector("#toast-wrap");
const loadingBox = document.querySelector("#profile-loading");
const loadingFill = document.querySelector("#loading-fill");
const loadingPercent = document.querySelector("#loading-percent");
const contentBox = document.querySelector("#profile-content");
const logoutBtn = document.querySelector("#logout-btn");

const profileTitle = document.querySelector("#profile-title");
const avatarImg = document.querySelector("#avatar-img");
const roleValue = document.querySelector("#role-value");
const idValue = document.querySelector("#id-value");
const usernameValue = document.querySelector("#username-value");
const emailValue = document.querySelector("#email-value");
const loginTypeValue = document.querySelector("#login-type-value");
const verifiedValue = document.querySelector("#verified-value");
const createdValue = document.querySelector("#created-value");

function getToastIcon(type) {
  if (type === "error") {
    return '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#ff8f8f" stroke-width="1.8"/><path d="M12 8v5" stroke="#ff8f8f" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1" fill="#ff8f8f"/></svg>';
  }

  return '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#6cf0b4" stroke-width="1.8"/><path d="m8.4 12.4 2.5 2.5 4.8-5.1" stroke="#6cf0b4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `${getToastIcon(type)}<span class="toast-text">${message}</span>`;
  toastWrap.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.2s ease";
  }, 2600);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function formatDate(iso) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function setLoadingProgress(value) {
  const safeValue = Math.max(0, Math.min(100, value));
  loadingFill.style.width = `${safeValue}%`;
  loadingPercent.textContent = String(safeValue);
}

function startFakeProgress() {
  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 4;
    if (progress >= 90) {
      progress = 90;
      clearInterval(timer);
    }
    setLoadingProgress(progress);
  }, 180);
  return timer;
}

function mapLoginType(type) {
  if (type === "EMAIL_PASSWORD") return "Email + Password";
  return type || "-";
}

function clearSessionAndGoLogin(message) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  showToast(message, "error");
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 900);
}

function fillProfile(user) {
  const username = user?.username || "User";
  profileTitle.textContent = `Welcome back, ${username}`;
  avatarImg.src = user?.avatar?.url || "https://via.placeholder.com/200x200.png";
  avatarImg.alt = `${username} avatar`;

  roleValue.textContent = user?.role || "-";
  idValue.textContent = user?._id || "-";
  usernameValue.textContent = username;
  emailValue.textContent = user?.email || "-";
  loginTypeValue.textContent = mapLoginType(user?.loginType);
  verifiedValue.textContent = user?.isEmailVerified ? "Verified" : "Not Verified";
  createdValue.textContent = formatDate(user?.createdAt);
}

async function getCurrentUser() {
  if (!token) {
    clearSessionAndGoLogin("Please login first.");
    return;
  }

  const progressTimer = startFakeProgress();

  try {
    const response = await fetch("https://api.freeapi.app/api/v1/users/current-user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearInterval(progressTimer);
        setLoadingProgress(100);
        clearSessionAndGoLogin("Session expired. Please login again.");
        return;
      }

      clearInterval(progressTimer);
      setLoadingProgress(100);
      showToast("Could not fetch profile right now.", "error");
      return;
    }

    const user = result?.data;
    fillProfile(user);

    clearInterval(progressTimer);
    setLoadingProgress(100);

    setTimeout(() => {
      loadingBox.classList.add("hidden");
      contentBox.classList.remove("hidden");
      showToast(`Welcome back, ${user?.username || "User"}.`, "success");
    }, 260);
  } catch (error) {
    clearInterval(progressTimer);
    setLoadingProgress(100);
    showToast("Network issue while loading profile.", "error");
  }
}

logoutBtn.addEventListener("click", (event) => {
  event.preventDefault();
  handleLogout();
});

window.addEventListener("load", getCurrentUser);

async function handleLogout() {
  const accessToken = localStorage.getItem("accessToken");

  try {
    if (accessToken) {
      await fetch("https://api.freeapi.app/api/v1/users/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  } catch (error) {
    showToast("Network issue while logging out. Clearing local session.", "error");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "../index.html";
  }
}
