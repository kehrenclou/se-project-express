# Around the U.S. Back End

# Project 4: Around The U.S. - Back End

This is a project that is a continuation of the createation of a social media type platform similar to Instagram with the ability to like photos/places. It is the 4th project of the Web Development/Software Engineering program at Paracticum by Yandex.
This is the beginning of working on the backend of this project using Express.js.
update: project updated with Schemas and additional functionality.
This iteration of the project has the userID hard coded in app.js will update in next project.

## Project Features

- Express.js
- ESLint
-

## Directories

`/controllers` — files to control how to output data.

`/models` — Schemas for User and Card

`/routes` — routing files..

`/utils` — error codes and regex.

## Entry point

`entry point` - app.js

## Routes

`GET /users` — returns all users.
`GET/users/:userId` — returns user by \_id.
`POST/users` — create new user.
`PATCH/users/me` — update profile.
`PATCH /users/me/avatar` — update avatar
`GET /cards` — returns all cards.
`POST/cards` — creates a card and sets the owner
`DELETE/cards/:cardId` — deletes a card by \_id.
`PUT/cards/:cardId/likes` — adds userId to card like array.
`DELETE/cards/:cardId/likes` — removes userId from card like array

## Running the Project

`npm run start` — to launch the server.

`npm run dev` — to launch the server with the hot reload feature.

## Link to Github Project

-coming soon

## Plan on improving project

- TBD
