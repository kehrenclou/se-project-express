// export const BASE_URL = "https://register.nomoreparties.co";
export const BASE_URL = "http://localhost:3000";

// export const BASE_URL = "http://localhost:3000";
const handleAuthResponse = (res) => {
  if (!res.ok) {
    throw Error(res.statusText);
  } else {
    return res.json();
  }
};
export const handleAuthError = (err) => {
  console.log(`Error: ${err}`);
  throw err;
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

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then(handleAuthResponse);
};
