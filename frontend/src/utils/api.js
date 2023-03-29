/* --------------------------------- imports -------------------------------- */
import {useAuth} from "../hooks";
/* -------------------------------- variables ------------------------------- */
const baseUrl ="http://localhost:3000";
/* -------------------------------- class Api ------------------------------- */
class Api {
  constructor({ baseUrl, headers }) {
    //constructor body
    this._baseUrl = baseUrl;

    this._headers = headers;
  }

  _request(url, options) {
    return fetch(url, options).then(this._handleResponse);
    // return fetch(url, options).then((res) =>
    //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    // );
  }

  //check difference between returning res and putting it in -request - may be ok to delete this part
  _handleResponse(res) {
    if (res.ok) {
      return  res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  // handleErrorResponse(err) {
  //   console.log(`Error: ${err}`);
  // }
  //3/27refactor
  handleErrorResponse = (err) => {
    console.log(`Error: ${err}`);
    throw err;
  };

  //this function appears to be redundant as things are moving around
  getAppInfo() {
    return Promise.all([this.getInfo(), this.getInitialCards()]);
  }
  getInfo=async() =>{
    //get user info from server
    return this._request(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
     
    });
  }

  getInitialCards() {
    //get cards ? from server
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

  setHeaders(headers) {
    this._headers = headers;
  }
}

/* --------------------------------- exports -------------------------------- */
//sets headers with token on all api calls
export const api = new Api({
  baseUrl: baseUrl,
  headers: {
    authorization: `Bearer ${useAuth.token}`,
    "Content-Type": "application/json",
  },
});
