# food-celebrator-capstone

## Project Overview

Food Celebrator is a web application that allows users to share and celebrate their favorite foods. It provides a platform to upload photos of meals, add captions, and interact with others by liking pictures, and posting comments on those pictures. The app uses Google AI image recognition to ensure that uploaded pictures are food-related, creating a dedicated space for culinary content. Users can register for an account, build a profile, engage with a feed of food images shared by the community, and view recipes.

## Features

- User Registration & Authentication: Users can sign up with a unique username, email, and password. Passwords are securely hashed, and JSON Web Tokens (JWT) are used to manage sessions for login/logout 
    

  

- Photo Uploads with Validation: Users can upload pictures of food along with a caption. Each image upload is analyzed by Google Cloud Vision API to verify it contains allowed food content. Images that don't meet the food-related criteria are rejected with an error message, ensuring the content stays on theme.
    

  

- Feed of Food Photos: The application features a centralized feed displaying all uploaded food photos from users. Each post in the feed shows the image, caption, uploader’s username, likes and comments on the photo. The feed updates as new pictures are added (with pagination or lazy loading implemented for scalability).
    

  

- Likes & Comments: Community engagement is enabled through likes and comments on photos. Users can like a picture (and unlike if desired), and the total like count is updated. They can also leave comments on a photo to share their thoughts or ask questions. These interactions allow users to appreciate each other’s posts and have discussions.
    

  

- User Profiles: Every user has a profile page showcasing their uploaded pictures and a short bio. Users can edit their bio and select a profile picture. The profile picture is chosen from a set of default avatars (referenced by an index number in the database) or from the user’s own uploads. Profiles allow others to browse a specific user’s contributions (all their food photos) and read about them.
    

  

- Recipe Catalogue: Food Celebrator also includes a recipe catalogue for the user to browse through, inspiring their future food posts. This recipe catalogue is powered by The Meal DB API.
    

  

- Responsive Design: The front-end interface is built to be responsive and mobile-friendly. Layout and styling are handled with Tailwind CSS utility classes, ensuring the app looks good on desktop and mobile screens. Users can comfortably browse the feed or upload content from any device.
    

## Tech Stack

## This project uses a modern web development stack with a separation of front-end and back-end concerns:

- Node.js & Express – Back-end runtime and framework for building the RESTful API. Express handles routing for authentication, image upload, feed retrieval, comments, and likes.
    
- PostgreSQL – Relational database for persisting all data, including user accounts, photos, comments, and likes. The Node pg library is used to connect to and query the PostgreSQL database. Database schema includes tables for users, pictures, comments, likes, and join tables for relationships (e.g. which user posted which picture, likes and comments linking users to pictures).
    
- React & Tailwind CSS – Front-end is built with React (a JavaScript library for user interfaces) and styled with Tailwind CSS for a clean, responsive UI. React enables a dynamic single-page application experience, and Tailwind’s utility classes are used for layout, styling, and responsiveness. The project also utilizes the React Icons library for consistent iconography in the UI (for example, heart icons for likes).
    
- JSON Web Token (JWT) – Used for authentication. On login, the server issues a JWT signed with a secret key, which the client stores and uses for subsequent requests. Protected routes (like uploading a photo or adding a comment) require a valid JWT. This ensures secure stateless auth without storing session data on the server.
    
- Multer – Node middleware for handling file uploads in Express. Multer is configured to accept image files from users (in memory) for validation and processing. Alongside Multer, express-fileupload and form-data libraries are included to facilitate file transfer and form handling on the server.
    
- Google Cloud Vision API – Integrated for image content analysis. When a user uploads an image, the server uses Google’s Vision API to perform label detection on the image. The app defines a list of allowed labels (primarily food-related terms) and checks the Vision API’s results against this list. Only images with a high confidence of containing food (or related items) pass validation; others are rejected to maintain the focus on food content.
    
- External Image Hosting - Uploaded images are not stored on the local server. Instead, the app uses external image hosting to store and retrieve images. The external server we used is through Namecheap, which runs the php file entitled upload. It is used to upload images and obtain their URLs. This keeps the application lightweight, as the heavy image files are served from an external CDN and not from the Node server.
    
- dotenv – Used for environment configuration. Sensitive settings and credentials (database URL, JWT secret, API keys, etc.) are stored in a .env file and loaded via the dotenv library. This allows easy configuration of the app for different environments (development, production) without hard-coding values.
    
- Additional Libraries: The app uses bcrypt for password hashing, ensuring stored passwords are secure. It also uses cors to allow the front-end development server and deployed site to communicate with the API safely, and morgan for logging HTTP requests during development for debugging purposes.
    

## Installation Guide

To set up the Food Celebrator project locally, follow these steps:

1. Prerequisites: Ensure you have Node.js (v14 or above recommended) and PostgreSQL installed on your system. You’ll also need a Google Cloud account with access to the Vision API if you want to enable image content validation (optional for basic functionality).
    

Clone the Repository: Clone this GitHub repository to your local machine using git:  
git clone https://github.com/gregkurka/food-celebrator-capstone.git

Then navigate into the project directory:  
cd food-celebrator-capstone 
    
Install Dependencies: Install the Node.js dependencies for both the server and client by running npm install in the root project directory. This will install Express, React, and all other required packages as listed in package.json:  
npm install

1. Configure Environment Variables: Create a file named .env in the root of the project (or set environment variables in your development environment) with the following keys:
    

- DATABASE_URL – The connection string for your PostgreSQL database For example, if running Postgres locally, use a URL like:  
    DATABASE_URL=postgres://<username>:<password>@localhost:5432/<your_database_name>  
    Make sure to create a database in Postgres for this project and put its name in the URL.
    
- JWT_SECRET – A secret key for JWT signing and verification. Set this to a long random string. This secret is used to sign authentication tokens for users.
    
- FRONTEND_URL – (Optional) The URL of the front-end application for CORS. In development, this can be http://localhost:5173 (the default port for Vite dev server). If you are not running a separate front-end dev server (because the Express server will serve the built client), you can omit this or set it to the same as your server origin.
    
- GOOGLE_APPLICATION_CREDENTIALS – (Optional, for Vision API) The file path to your Google Cloud service account credentials JSON file. This is required if you want to enable the Google Vision API for image moderation. Obtain a service account JSON key from Google Cloud and save it locally, then provide its path here. Alternatively, you can set up the Google Cloud environment variables as per Google’s documentation. If this variable is not set and you attempt to upload images, the Vision API call will fail – you can disable or remove the Vision validation in code for testing without it.
    

  

1. Note: Instead of storing actual credentials in the .env file, use placeholder values and ensure you keep this file secure and not committed to version control.
    

Database Setup and Seeding: The application can automatically create the required tables and even seed some initial data. To set up the database schema, run the seed script:  
npm run seed

1.  This will connect to the database, create tables, and insert sample data (users, pictures, comments, and likes). You should see logs indicating tables being created. The seed script will also create a few test users with predefined credentials for convenience. For example, a user gregk with password pw_gregk, and several others (see the server/seed.js for all test users and data). You can use these accounts to log in and test the app immediately.
    
6. Build Client (Optional): The repository includes a pre-built client in the client/dist folder, so building the front-end manually is usually not required to run the app. However, if you plan to modify the front-end code, you will need to rebuild it. Assuming the project uses Vite for the React app, you can run the build (if a script is configured) or start the Vite dev server. (If no specific build script is present in package.json, the static files are already prepared for use.)
    

- To build the production-ready static files (if needed): [Add the appropriate build command here if it exists, e.g., npm run build].
    
- To run the front-end in development (optional): You can serve the front-end separately by navigating to the client directory and running the dev server (for example, npm run dev if using Vite or Create React App). Ensure that FRONTEND_URL is set so the backend accepts requests from the dev server origin.
    

1. Start the Application: Once everything is configured, you can start the Node.js server.
    

For development, it’s recommended to use nodemon for auto-reloading:  
npm run dev

-  This will launch the Express server on port 3000 by default (or the port set in your PORT env variable). The server will also serve the client from the client/dist directory. Leave this running and proceed to open the app in your browser.
    

For production or without nodemon:  
npm start

-  This runs the server using Node (without file watching). Make sure to build the client before this if you made changes to front-end code.
    

1. Verify Setup: Open your web browser and navigate to http://localhost:3000 (or the custom port you set) to access Food Celebrator. You should see the home page of the application. From here, you can register a new account or use one of the seeded test accounts to log in. After logging in, try uploading an image and adding a caption to verify that everything is working. If the image upload succeeds and the image is of food, it will appear in the feed. You can also test liking and commenting features.
    

## Running the Project

After installation, running the project involves launching the server (and optionally the front-end dev server if you are working on UI changes). Below are common use cases for running the application:

- Development Mode: Use npm run dev to start the backend with nodemon. This will serve the app at [localhost:3000](http://localhost:3000/). In development, you might also run a React dev server on [localhost:5173](http://localhost:5173/) for hot-reloading the front-end. With the proper CORS setup, the React dev server can proxy API requests to the Express server. Typically:
    

- Run npm run dev to start the Express server (API + static client).
    
- (Optional) In another terminal, navigate to client and run npm run dev (if using Vite) to start the front-end development server. This provides live reloading for UI changes. Ensure FRONTEND_URL=http://localhost:5173 is set so the backend accepts requests from the front-end dev server.
    
- Access the app via the front-end URL (5173) for development, or 3000 if using the built client. Both should work in dev. You can log in and use features; API calls will route to the Express server.
    

- Production Mode: Use npm start to run the server normally, serving the pre-built front-end. In this mode, the app will rely on the files in client/dist for the UI. Visit [localhost:3000](http://localhost:3000/) to use the application. This is the mode you would use in a deployed environment.
    
- Database: Ensure the PostgreSQL database is running whenever you start the server. If the server starts successfully, you should see a console message like “Connected to PostgreSQL” and “Server running on port 3000” in your terminal. If not, double-check your DATABASE_URL or database service.
    
- Using the App: Once the server is running, you can interact with the application:
    

- Create a new account via the Sign Up page, or log in with an existing account.
    
- On successful login, you’ll be directed to the main feed. Try uploading a new picture using the upload form. When you submit, the image will be processed (this may take a couple of seconds due to the Vision API call and image upload).
    
- If the upload is accepted, your photo will appear in the feed. You and other users can click the heart icon to like the photo, or leave a comment using the comment form.
    
- Navigate to your profile page (usually via a profile link or username) to edit your bio or see all your uploads. You can test editing the bio text and see it update.
    
- To test as different users, you can log out and log back in as another account (for instance, one of the seeded accounts). This allows you to see another perspective, like liking someone else’s photo or commenting.
    

## Additional Notes

- Postman Collection: A Postman collection is provided in the file postman-import.json. You can import this into Postman to quickly test all API endpoints (auth routes, image upload, like/comment, etc.) with predefined requests. This is useful for manually verifying the backend functionality.
    

Seed Data: The included seed script generates sample data for testing. It creates five users with usernames gregk, ericr, biknah, mikew, zachs (and passwords pw_gregk, pw_ericr, etc.), along with a set of pictures and comments for those users.**
