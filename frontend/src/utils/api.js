class Api {
  constructor({ baseUrl, headers }) {
    //constructor body
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

  handleErrorResponse(err) {
    console.log(`Error: ${err}`);
  }

  getInfo() {
    //get user info from server
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: "GET",
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
    return this._request(`${this._baseUrl}/cards/likes/${cardId}`, {
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
}
/* ------------------------- Api class - set up Api ------------------------- */

const baseUrl = "https://around.nomoreparties.co/v1/group-12";
const token = "72dee144-4e03-4ccf-86c7-08640cb55eca";
const api = new Api({
  baseUrl: baseUrl,
  headers: { authorization: token, "Content-Type": "application/json" },
});

/* --------------------------------- exports -------------------------------- */
export default api;
