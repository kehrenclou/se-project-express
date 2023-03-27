import { useAuth } from "../hooks";

const baseUrl = "http://localhost:3000";

class Api {
  constructor({ baseUrl, headers, token, props }) {
    //constructor body
    super(props);
    this._baseUrl = baseUrl;

    this._headers = headers;
    //added32623
    this._token = token;

    this.state={ headers: {
      authorization: `Bearer ${useAuth.token}`,
      "Content-Type": "application/json",
    },}
  }
  //singletonpattern - having and api object (utility tused to make request)
  //always using the same object for all of your requests
  //create the api in this file
  //refactor to use singleton
  //import instance of api
  //provide a function on the class to set headers - use effect, usememo
  //first time app loads o
  //useeffect depend on token

  _request(url, options) {
    return fetch(url, options).then(this._handleResponse);
    // return fetch(url, options).then((res) =>
    //   res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    // );
  }

  //check difference between returning res and putting it in -request - may be ok to delete this part
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  handleErrorResponse(err) {
    console.log(`Error: ${err}`);
  }

  getAppInfo() {
    return Promise.all([this.getInfo(), this.getInitialCards()]);
  }

  //should have a token
  getInfo() {
    //get user info from server
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
      method: "GET",
    });
  }
  //this should have a token
  getInitialCards() {
    //get cards ? from server
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
      method: "GET",
    });
  }
  //should have token
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
  //update profile picture - token
  setProfileAvatar(avatarLink) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({ avatar: avatarLink }),
    });
  }
  //save new card-token
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
  //check token
  changeLikeCardStatus(cardId, like) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: this._headers,
      method: like ? "PUT" : "DELETE",
      body: JSON.stringify(),
    });
  }

  //delete card - needs token
  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      headers: this._headers,
      method: "DELETE",
    });
  }
}
//added32723
setHeaders(token){
  this.setState = {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
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
// export const api = new Api({
//   baseUrl: baseUrl,
// token:useAuth.token,
 
// });
/* --------------------------------- exports -------------------------------- */
