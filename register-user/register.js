const registerForm = document.querySelector("#register-form");
const usernm = document.querySelector("#username");
const pass = document.querySelector("#pass");
const email = document.querySelector("#mail");
const registerBtn = document.querySelector("#registerbtn");
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
  registerBtn.disabled = isLoading;
  btnText.textContent = isLoading ? "Creating..." : "Register";
  btnLoader.classList.toggle("active", isLoading);
  progress.classList.toggle("active", isLoading);
}

function getSafeErrorMessage(status, data) {
  if (status === 409) return "This email or username is already registered.";
  if (status === 400) return "Please check your details and try again.";
  if (status === 401 || status === 403) return "You are not allowed to perform this action.";
  if (status >= 500) return "Service is temporarily unavailable. Please try again.";

  const apiMessage = data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage.slice(0, 120);
  }

  return "Unable to register right now. Please try again.";
}

function validateInputs() {
  const username = usernm.value.trim();
  const userEmail = email.value.trim();
  const password = pass.value;

  if (!username || username.length < 3) {
    return "Username must be at least 3 characters.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(userEmail)) {
    return "Please enter a valid email address.";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return null;
}

async function registerUser(event) {
  event.preventDefault();

  const validationMessage = validateInputs();
  if (validationMessage) {
    showToast(validationMessage, "error");
    return;
  }

  const url = "https://api.freeapi.app/api/v1/users/register";
  const payload = {
    email: email.value.trim(),
    password: pass.value,
    role: "USER",
    username: usernm.value.trim(),
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

    showToast("Registration successful. You can log in now.", "success");
    registerForm.reset();
  } catch (error) {
    showToast("Network issue. Check your connection and retry.", "error");
  } finally {
    setLoading(false);
  }
}

registerForm.addEventListener("submit", registerUser);
registerBtn.addEventListener("click", registerUser);
