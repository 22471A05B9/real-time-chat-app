# Real-Time Chat Application

A responsive chat application where messages are exchanged in real time using Socket.io.

## Screenshots
_Add 2-3 screenshots here: save them in a `screenshots/` folder, then use `![Chat window](screenshots/chat.png)`. Two browser windows chatting makes a good screenshot._

## Features
- Real-time messaging with Socket.io: messages appear instantly for everyone
- Responsive React.js interface
- Node.js and Express.js backend that serves the client and handles the socket events
- MongoDB (Mongoose) stores the last messages, which are loaded when someone joins. Without MongoDB the app still works and keeps messages in memory.
- Join and leave notices, input cleaning (name up to 20 characters, messages up to 500)

## Tech stack
React.js (CDN), Node.js, Express.js, MongoDB with Mongoose, Socket.io

## Requirements
- Node.js 18 or newer and npm
- Optional: MongoDB running locally, or a free MongoDB Atlas connection string

## How to run
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env   (then edit MONGO_URI, or leave it out)
npm start
```
Open http://localhost:3000 in two browser windows, enter two different names and chat.

## Project structure
```
server/index.js      Express + Socket.io + MongoDB
server/validate.js   input cleaning helpers
client/              React interface (index.html, app.js, style.css)
```

## Deploy
GitHub Pages only hosts static files, so this app needs a Node host such as Render (free): create a Web Service from this repository, set the build command to `npm install`, the start command to `npm start`, and add `MONGO_URI` as an environment variable.

## Author
Lakshmiprasanna Pentyala - [LinkedIn](https://www.linkedin.com/in/lakshmiprasanna-pentyala-3a554236b/) | [GitHub](https://github.com/22471A05B9)
