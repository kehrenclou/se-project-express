// export const BASE_URL = "https://register.nomoreparties.co";
// export const BASE_URL = "http://localhost:3000";
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.kedoodledev.crabdance.com"
    : "http://localhost:3000";

const handleAuthResponse = (res) => {
  if (!res.ok) {
   return Promise.reject(`Error:${res.status}`)
  } else {
    return res.json();
  }
};


export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(handleAuthResponse);
};

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(handleAuthResponse);
};
