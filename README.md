# [LIIST.ME](https://liist.me/)

> liist.me lets you store playliists of music for safe keeping & reference.

---

## Features

- The app allows users to give each liist a unique name & description and tracks can be added or removed at any time
- Users can choose between a simple light or dark theme at any time
- A reference of upcoming features and app development is available

---

## Screenshots

Landing Page:

![landing page](/img/landing_page.png)

Liist Page:

![liist page](/img/liist_page-light.png)

Dark Mode:

![dark mode](/img/liist_page-dark.png)

Features Page:

![features page](/img/features_page.png)

---

## API

> the API sends & receives JSON data and most HTML is dynamically generated in the client.

- /liists endpoint for GET, POST operations of liists
- /liists/:id endpoint for PUT, DELETE operations
- /users endpoint for GET, POST operations of users

---

## Technologies

### Client

- HTML5, CSS, JavaScript ES6
- [jQuery](https://jquery.com/) for DOM manipulation, event listening & AJAX
- [Google Fonts](https://fonts.google.com/) & [Font Awesome](https://fontawesome.com/) for styling

### Server

- [Node.js](https://nodejs.org/en/) & [Express](https://expressjs.com/) for web server & API
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) for data persistence & modeling
- [ESLint](https://eslint.org/), [Mocha](https://mochajs.org/) & [Chai](https://www.chaijs.com/) for linting, unit & integration testing
- [Travis CI](https://travis-ci.org/), [Heroku](https://www.heroku.com/home) & [mLab](https://mlab.com/) for deployment

---

## Project Roadmap

> Here's a peek at features that are in the works to be added to the app as it evolves.

### User Authentication & Experience

- modern authentication with [JWTs](https://jwt.io/) & [Passport](http://www.passportjs.org/)
- private & public liists
- ability to share link to public, read-only liist for non-authenticated users
- ability to sort & re-order liists
- collaborative liists
- commenting system

### External APIs

- [Apple Music](https://developer.apple.com/documentation/applemusicapi?changes=_9) & [Spotify](https://developer.spotify.com/documentation/web-api/) integrations
  - login, playback, search & metadata
- [bit.ly](https://bitly.com/) url shortening for sharing

---

## Created By Jaiwoo

## feedback? - info@jaiwoo.me
