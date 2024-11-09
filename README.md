# Link-Share App
A MERN stack application that allows users to post and store links from various platforms. These links are displayed with a preview page that can be easily shared with friends, family, and potential employers.

## Table of Contents

1. [Project Overiew](#project-overiew)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation and Setup](#installation-ans-setup)

## Project Overiew
The **Link-Share App** allows users to store and share links from different platforms. Each link is presented with a rich preview, making it easier to differnetiate between them from others. The app also provides a shareable preview page for all the saved links, which can be distributed among social contacts or shared with potential employers.

## Features

- **User Authentication**: Users can sign up, log in, and manage their accounts.
- **Link Posting**: Users can submit and store links from various platforms.
- **User Profile Upadating**: A user can update thier profile on the app - picture, firstname, lastname and email 
- **Link Previews**: The app generates preview pages for all links posted, including the information user's picture, name, and email.
- **Sharing**: Link can be shared via unique preview page URLs.
- **Responsive UI**: The frontend is fully responsive and works on both mobile and desktop devices.


## Tech Stack

- **Frontend**:
    - React(Typescript)
    - Tailwind CSS (for styling)
    - Context API (for statement management)
    - Axios (for API calls)
    - Vite (for build optimization)

- **Backend**:
    - Node.js
    - Express
    - MOngoDB
    - Mongoose (for MongoDB ODM)
    - JWT (for authentication)

## Installation and Setup

### Backend Setup
1. clone the repository and navigate to the backend folder:
    ```bash
    git clone https://github.com/Jbsmall17/link-sharing-webapp.git
    cd link-sharing-app-folder/backend
2.  install dependencies
    ```bash
    npm install
3.  setup environment variables by creating a .env file
    ```bash
    touch .env
4. Add the following to the .env file
    ```bash
    PORT=
    MONGODB_URL=<your-mongodb-url>
    JWT_SECRET=<your-jwt-secret>
    email=<your-email>
    password=<your-password>
5. Start the backend server
    ```bash
    npm run dev

### Frontens Setup
1. credentials:
   username: testuser1@mailinator.com
   password: testuser1
2. The frontend should be running on http://localhost:5173/

### Backend Setup
1. Navigate to the frontend folder:
    ```bash
    cd ../link-sharing-webapp
2. Install dependencies:
    ```bash
    npm install
3. Start the frontend development server:
    ```bash
    npm run dev
4. The backend is hosted on free plan on render. it might take 3 - 5 minutes to get response on first request
