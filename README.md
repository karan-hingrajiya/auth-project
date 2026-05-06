# Auth Project

A frontend auth workflow project built with vanilla HTML, CSS, and JavaScript.

This project includes:
- Login flow
- Register flow
- Profile (`getme`) flow
- Shared auth UI theme
- Toast notifications, loaders, and interactive states

## Live Flow Overview

1. User opens the app (root page).
2. User logs in using `username + password`.
3. On success, app stores `accessToken` in `localStorage`.
4. User is redirected to profile page (`getme`).
5. Profile page calls current-user API with Bearer token.
6. If token is missing/expired, user is redirected back to login.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- FreeAPI Auth endpoints

## Folder Structure

```text
auth-project/
├─ common/
│  └─ auth-theme.css            # Shared auth styling (cards, inputs, toasts, loader styles)
├─ login-user/
│  └─ login.js                  # Login API call + token storage + redirect
├─ register-user/
│  ├─ index.html                # Register page
│  └─ register.js               # Register API call + validation + toasts
├─ user-profile/
│  ├─ getme.html                # Dynamic profile page markup
│  ├─ getme.css                 # Profile-specific styling
│  └─ getme.js                  # Fetch current user + render + session handling
├─ logout-user/
│  └─ logout.js                 # Reserved for logout logic (optional extension)
├─ login.html                   # Login page UI entry
└─ index.html                   # Root entry page (homepage for Vercel)
```

## API Endpoints Used

- Register: `POST https://api.freeapi.app/api/v1/users/register`
- Login: `POST https://api.freeapi.app/api/v1/users/login`
- Current User: `GET https://api.freeapi.app/api/v1/users/current-user`

## Authentication Behavior

- `accessToken` is stored in `localStorage` after successful login.
- `getme` page reads token from `localStorage` and sends:
  - `Authorization: Bearer <accessToken>`
- If token is invalid, expired, or missing:
  - Session is cleared
  - User is redirected to login/home page

## UI/UX Features

- Dark auth theme with reusable shared CSS
- Animated form interactions
- Top-right toast notifications with success/error icons
- Login/register button loading states
- Profile page dynamic loading bar with percentage
- Dynamic rendering of user data from API response

## Run Locally

Since this is static frontend code, you can run it with any local static server.

Example (VS Code Live Server):
1. Open `auth-project`
2. Run Live Server
3. Open `index.html`

## Vercel Deployment Notes

To avoid `404 NOT_FOUND`:

1. Ensure repository root contains `index.html`.
2. In Vercel Project Settings:
   - Root Directory:
     - Leave empty if this repo is already `auth-project`, or
     - Set to `auth-project` if it is inside a monorepo.
3. Do not set Root Directory to a file path like `login-user/login.html`.

## Common Issues

### 1) Credentials appearing in query string
Cause: native form submit with GET.
Fix in this project:
- JS `preventDefault()`
- Form/button configured to avoid default GET behavior
- API requests sent via `fetch` `POST` JSON body

### 2) Vercel root 404
Cause: missing root `index.html` or wrong root directory setting.
Fix:
- keep root `index.html`
- set correct Root Directory

## Future Improvements

- Backend-set `HttpOnly` refresh-token cookie (more secure production setup)
- Dedicated logout API integration
- Route guard utility for all protected pages
- Token refresh flow + silent re-auth

## Author

Built by **karan-hingrajiya** as part of auth workflow practice and deployment learning.
