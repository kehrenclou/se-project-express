import { useAuth } from "../hooks";

// const baseUrl = "http://localhost:3000";
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.kedoodledev.crabdance.com"
    : "http://localhost:3000";

    class Api {
  constructor({ baseUrl, headers }) {

    this._baseUrl = baseUrl;

    this._headers = headers;
  }

  _request(url, options) {
    return fetch(url, options).then(this._handleResponse);

  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  handleErrorResponse = (err) => {
    console.log(`Error: ${err}`);
  };


  getInfo = () => {
    //get user info from server
    return this._request(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    });
  };

  getInitialCards() {
    //get cards from server
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "GET",
    });
  }

  setUserInfo(inputName, inputAbout) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({
        name: inputName,
        about: inputAbout,
      }),
    });
  }
  //update profile picture
  setProfileAvatar(avatarLink) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({ avatar: avatarLink }),
    });
  }
  //save new card
  addNewCard(inputName, inputLink) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify({
        name: inputName,
        link: inputLink,
      }),
    });
  }

  //change like status
  changeLikeCardStatus(cardId, like) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: like ? "PUT" : "DELETE",
      body: JSON.stringify(),
    });
  }

  //delete card
  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._headers,
      method: "DELETE",
    });
  }

  //set headers
  setHeaders(headers) {
    this._headers = headers;
  }
}

//sets headers with token on all api calls
export const api = new Api({
  baseUrl: baseUrl,
  headers: {
    authorization: `Bearer ${useAuth.token}`,
    "Content-Type": "application/json",
  },
});
