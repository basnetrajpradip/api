# DevDash Blog - API

Welcome to the server-side repository of DevDash Blog! This repository contains the back-end codebase for the DevDash Blog application, a platform for developers to read insights, tutorials, and experiences in the ever-evolving world of technology.

---

## Live Preview

Live preview of the web app is [Here](https://devdash-blog.vercel.app/).

---

![devdash-home](https://github.com/basnetrajpradip/readme-images/assets/119044572/828d7cb2-2be9-4fbb-ac02-7cb96c9fb16d)

---

## About DevDash Blog

DevDash Blog is a modern web application designed to provide a seamless and intuitive blogging experience for developers. Whether you're a seasoned developer or just starting your journey, DevDash Blog is your go-to destination for knowledge, connecting with fellow developers, and exploring the latest trends in tech.

---

## Features

- **User Authentication:** Secure user authentication system for registering, logging in, and managing user accounts.
- **Create, Update & Delete posts with Admin rights:** Intuitive interface for creating, editing, and publishing blog posts.
- **Engage with Community:** Interact with other developers by commenting on posts.
- **Responsive Design:** Mobile-friendly design ensures a seamless browsing experience across devices of all sizes.

---

## Technologies Used

- **Express JS** Lightweight back-end framework of Node JS for server side application.
- **React:** Front-end framework for building dynamic and interactive user interfaces.
- **MongoDB** Non relational database deployed at Mongo Atlas.
- **React Router:** Routing library for handling navigation and URL routing within the application.
- **Axios:** Promise-based HTTP client for making API requests to the server-side backend.
- **Chakra UI Components:** Component library for styling React components with ease.
- **JWT Authentication:** JSON Web Tokens for secure user authentication and authorization.

---

## Getting Started

To get started with the DevDash Blog server-side application, follow these steps:

1. Set up a Node.js development environment.

2. Clone this repository to your local machine:

   ```bash
   git clone <repository-url>
   ```

3. Install dependencies using npm:

   ```bash
   npm install
   ```

> **Note:** This server side app uses a MongoDB database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).So inorder to make the app function, One must create an atlas cluster and a database and add the connection string by creating .env file at root of the project as:

```bash
# .env file
MONGODB_URI= <your mongo db connection string>
```

4. Similarly we need to add some more environment variables inorder to get the api up and running. Add the following env variable in the .env file along with MONGODB_URI.

```bash
# .env file
ORIGIN_URL= <Client side app url (i.e http://localhost:5173)>
REFRESH_TOKEN_SECRET= <secret key string for refresh token>
ACCESS_TOKEN_SECRET= <secret key string for access token>
```

> **Note:** You can either put some random string in secret key string or generate the secret key string by running node as REPL in your terminal as:

```bash
# run node as REPL
node

#generate string for secret key
require("crypto").randomBytes(64).toString("hex")
```

5.Then you can start your API server as:

```bash
npm run serverstart
```
