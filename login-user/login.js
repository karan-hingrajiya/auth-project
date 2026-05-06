const loginForm = document.querySelector("#login-form");
const usernm = document.querySelector("#username");
const pass = document.querySelector("#pass");
const loginBtn = document.querySelector("#loginbtn");
const btnText = document.querySelector("#btn-text");
const btnLoader = document.querySelector("#btn-loader");
const progress = document.querySelector("#progress");
const toastWrap = document.querySelector("#toast-wrap");

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

function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  btnText.textContent = isLoading ? "Signing in..." : "Login";
  btnLoader.classList.toggle("active", isLoading);
  progress.classList.toggle("active", isLoading);
}

function getSafeErrorMessage(status, data) {
  if (status === 400) return "Please enter valid username and password.";
  if (status === 401) return "Invalid username or password.";
  if (status === 403) return "Your account is not allowed to login.";
  if (status >= 500) return "Login service is unavailable. Try again shortly.";

  const apiMessage = data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.slice(0, 120);
  }

  return "Unable to login right now. Please try again.";
}

function validateInputs() {
  const username = usernm.value.trim();
  const password = pass.value;

  if (!username || username.length < 3) {
    return "Please enter a valid username.";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

async function loginUser(event) {
  event.preventDefault();

  const validationMessage = validateInputs();
  if (validationMessage) {
    showToast(validationMessage, "error");
    return;
  }

  const url = "https://api.freeapi.app/api/v1/users/login";
  const payload = {
    username: usernm.value.trim(),
    password: pass.value,
  };

  setLoading(true);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      showToast(getSafeErrorMessage(response.status, data), "error");
      return;
    }

    showToast("Login successful. Welcome back.", "success");
    loginForm.reset();
    setTimeout(() => {
      window.location.href = "../user-profile/getme.html";
    }, 700);
  } catch (error) {
    showToast("Network issue. Check your connection and retry.", "error");
  } finally {
    setLoading(false);
  }
}

loginForm.addEventListener("submit", loginUser);
loginBtn.addEventListener("click", loginUser);
