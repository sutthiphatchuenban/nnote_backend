# NNote Backend API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-blueviolet.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-brightgreen.svg)](https://neon.tech/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Cloudinary-blue.svg)](https://cloudinary.com/)

This repository contains the backend API for NNote, a robust note-taking application. It provides secure authentication (including Google OAuth), note management (CRUD operations), image uploads via Cloudinary, and public note sharing. The API is built with Node.js, Express.js, and Prisma, utilizing a PostgreSQL database (Neon.tech recommended).

## ✨ Features

*   **User Authentication:** Secure user registration and login with JWT.
*   **Google OAuth:** Seamless sign-in/sign-up using Google accounts.
*   **Note Management:** Create, read, update, and delete notes.
*   **Public Notes:** Share notes publicly with unique slugs.
*   **Anonymous Notes:** Option to create notes without revealing author identity.
*   **Image Uploads:** Integrate with Cloudinary for efficient image storage.
*   **Rate Limiting:** Protects against brute-force attacks and abuse.
*   **CORS & Helmet:** Enhanced security with Cross-Origin Resource Sharing and HTTP headers.
*   **Prisma ORM:** Type-safe database access with PostgreSQL.
*   **Environment Variables:** Secure configuration management using `.env`.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   Node.js (v18 or higher)
*   npm (Node Package Manager)
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/65011211019/nnote.git
    cd nnote/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the following:
    ```
    DATABASE_URL="postgresql://neondb_owner:npg_52LrawCiJPUW@ep-wispy-fog-a1hdmwfk-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    JWT_SECRET=your_jwt_secret_key_here
    GOOGLE_CLIENT_ID=your_google_client_id_here
    GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    PORT=3001
    NODE_ENV=development
    CLOUD_NAME=your_cloudinary_cloud_name
    API_KEY=your_cloudinary_api_key
    API_SECRET=your_cloudinary_api_secret
    ```
    *   **`DATABASE_URL`**: Your PostgreSQL connection string. Neon.tech is recommended for easy setup.
    *   **`JWT_SECRET`**: A strong, random string for JWT token signing.
    *   **`GOOGLE_CLIENT_ID`** and **`GOOGLE_CLIENT_SECRET`**: Obtain these from the Google Cloud Console for OAuth.
    *   **`CLOUD_NAME`**, **`API_KEY`**, **`API_SECRET`**: Obtain these from your Cloudinary dashboard for image uploads.

4.  **Set up the database:**
    This project uses Prisma with PostgreSQL.

    *   **Migrate your database schema:**
        ```bash
        npx prisma migrate deploy
        ```
    *   **Generate Prisma client:**
        ```bash
        npx prisma generate
        ```
    *   (Optional) **Open Prisma Studio to view your database:**
        ```bash
        npx prisma studio
        ```

### Running the Application

*   **Development Mode (with Nodemon for auto-restarts):**
    ```bash
    npm run dev
    ```

*   **Production Mode:**
    ```bash
    npm start
    ```

The API will be running on `http://localhost:3001` (or your specified `PORT`).

## 📚 API Endpoints

All endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)

*   `POST /google`: Authenticate/register user with Google OAuth credential.
*   `POST /google/mock`: (Development only) Mock Google authentication.
*   `GET /me`: Get current authenticated user's details. (Requires JWT)

### Notes (`/api/notes`)

*   `GET /`: Get all notes for the authenticated user. (Requires JWT)
*   `POST /`: Create a new note. (Requires JWT)
*   `PUT /:id`: Update an existing note by ID. (Requires JWT)
*   `DELETE /:id`: Delete a note by ID. (Requires JWT)
*   `GET /:id`: Get a single note by ID for the authenticated user. (Requires JWT)
*   `POST /upload-image`: Upload an image to Cloudinary. (Requires JWT)

### Public Notes (`/api/public`)

*   `GET /notes`: Get a paginated list of public notes.
    *   Query parameters: `page` (default 1), `limit` (default 10)
*   `GET /notes/:slug`: Get a single public note by its unique slug.

## 🛠️ Technologies Used

*   **Node.js**: JavaScript runtime.
*   **Express.js**: Web application framework.
*   **Prisma**: Next-generation ORM for Node.js and TypeScript.
*   **PostgreSQL (Neon.tech)**: Relational database.
*   **JWT**: JSON Web Tokens for authentication.
*   **Google OAuth2Client**: For Google authentication.
*   **Cloudinary**: Cloud-based image and video management.
*   **Bcryptjs**: For password hashing (though currently only Google OAuth is implemented for user creation, this is a common dependency for auth).
*   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
*   **Helmet**: Helps secure Express apps by setting various HTTP headers.
*   **Morgan**: HTTP request logger middleware.
*   **Express Rate Limit**: Basic rate-limiting middleware.
*   **Dotenv**: Loads environment variables from a `.env` file.
*   **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.
*   **Nodemon**: (Development) Automatically restarts the node application when file changes are detected.

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
