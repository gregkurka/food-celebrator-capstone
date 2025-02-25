const bcrypt = require("bcrypt");

require("dotenv").config();
const { Client } = require("pg");

// Configure PostgreSQL connection using Render's DATABASE_URL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render-hosted PostgreSQL
  },
});

// Connect to PostgreSQL

module.exports = client;

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS comments_x_pictures_x_users;
    DROP TABLE IF EXISTS likes_x_pictures_x_users;
    DROP TABLE IF EXISTS likes;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS users_x_pictures;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS pictures;
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE pictures (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        URL VARCHAR(2083) NOT NULL,
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE users_x_pictures (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        picture_id UUID NOT NULL REFERENCES pictures(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, picture_id)
    );
    CREATE TABLE comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE likes_x_pictures_x_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        picture_id UUID NOT NULL REFERENCES pictures(id) ON DELETE CASCADE,
        like_id UUID NOT NULL REFERENCES likes(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, picture_id, like_id)
    );
    CREATE TABLE comments_x_pictures_x_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        picture_id UUID NOT NULL REFERENCES pictures(id) ON DELETE CASCADE,
        comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, picture_id, comment_id)
    );
  `;
  await client.query(SQL);
};

const createUser = async ({ username, password, email }) => {
  const SQL = `
      INSERT INTO users (username, password, email)
      VALUES($1, $2, $3)
      RETURNING *;
    `;
  const hashedPassword = await bcrypt.hash(password, 5);
  const response = await client.query(SQL, [username, hashedPassword, email]);
  return response.rows[0];
};

const createPicture = async ({ URL, caption }) => {
  const SQL = `
    INSERT INTO pictures (URL, caption)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const response = await client.query(SQL, [URL, caption]);
  return response.rows[0];
};

const linkUserToPicture = async ({ user_id, picture_id }) => {
  const SQL = `
    INSERT INTO users_x_pictures (user_id, picture_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const response = await client.query(SQL, [user_id, picture_id]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username, email, created_at FROM users
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchPictures = async () => {
  const SQL = `
    SELECT id, URL, caption, created_at FROM pictures
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchPictureById = async (picture_id) => {
  const SQL = `
    SELECT id, URL, caption, created_at FROM pictures WHERE id = $1;
  `;
  const response = await client.query(SQL, [picture_id]);
  return response.rows;
};

const fetchUserPictures = async (user_id) => {
  const SQL = `
    SELECT pictures.id, pictures.URL, pictures.caption, pictures.created_at
    FROM users_x_pictures
    JOIN pictures ON users_x_pictures.picture_id = pictures.id
    WHERE users_x_pictures.user_id = $1;
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const fetchUserPicturesByUsername = async (username) => {
  const SQL = `
    SELECT 
    users.username,
    users.id AS user_id,
    pictures.id AS picture_id,
    pictures.url AS picture_url,
    pictures.caption AS picture_caption,
    pictures.created_at AS picture_createdat
    FROM users_x_pictures
    JOIN users ON users_x_pictures.user_id = users.id
    JOIN pictures ON users_x_pictures.picture_id = pictures.id
    WHERE users.username = $1;
  `;
  const response = await client.query(SQL, [username]);
  return response.rows;
};

const fetchPictureByUsernameAndId = async ({ username, picture_id }) => {
  const SQL = `
    SELECT 
    users.username,
    users.id AS user_id,
    pictures.id AS picture_id,
    pictures.url AS picture_url,
    pictures.caption AS picture_caption,
    pictures.created_at AS picture_createdat
    FROM users_x_pictures
    JOIN users ON users_x_pictures.user_id = users.id
    JOIN pictures ON users_x_pictures.picture_id = pictures.id
    WHERE users.username = $1 AND pictures.id=$2;
  `;
  const response = await client.query(SQL, [username, picture_id]);
  return response.rows[0];
};

const deleteUser = async (id) => {
  const SQL = `
    DELETE FROM users WHERE id = $1 RETURNING *;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const deletePicture = async (id) => {
  const SQL = `
    DELETE FROM pictures WHERE id = $1 RETURNING *;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const deleteUserPictureLink = async ({ user_id, picture_id }) => {
  const SQL = `
    DELETE FROM users_x_pictures WHERE user_id = $1 AND picture_id = $2 RETURNING *;
  `;
  const response = await client.query(SQL, [user_id, picture_id]);
  return response.rows[0];
};

const fetchUserPictureLinks = async () => {
  const SQL = `
    SELECT * FROM users_x_pictures;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchFeed = async () => {
  const SQL = `
    SELECT 
      ux.user_id, 
      ux.picture_id, 
      p.URL, 
      p.caption, 
      p.created_at, 
      u.username
    FROM users_x_pictures ux
    JOIN pictures p ON ux.picture_id = p.id
    JOIN users u ON ux.user_id = u.id;
  `;
  const response = await client.query(SQL);
  return response.rows;
};
//--CREATE FUNCTIONS--
const createComment = async ({ content }) => {
  const SQL = `
    INSERT INTO comments (content)
    VALUES ($1)
    RETURNING *;
  `;
  const response = await client.query(SQL, [content]);
  return response.rows[0];
};

const createLike = async () => {
  const SQL = `
    INSERT INTO likes DEFAULT VALUES RETURNING *;
  `;
  const response = await client.query(SQL);
  return response.rows[0];
};

//--DELETE FUNCTIONS--
const deleteComment = async (id) => {
  const SQL = `
    DELETE FROM comments WHERE id = $1 RETURNING *;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const deleteLike = async (id) => {
  const SQL = `
    DELETE FROM likes WHERE id = $1 RETURNING *;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

//--Adds comments ids into comments_x_pictures_x_users table--
const linkCommentPictureAndUser = async ({
  user_id,
  picture_id,
  comment_id,
}) => {
  const SQL = `
    INSERT INTO comments_x_pictures_x_users (user_id, picture_id, comment_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const response = await client.query(SQL, [user_id, picture_id, comment_id]);
  return response.rows[0];
};
//--Adds likes ids into likes_X_pictures_x_users table--
const linkLikePictureAndUser = async ({ user_id, picture_id, like_id }) => {
  const SQL = `
    INSERT INTO likes_x_pictures_x_users (user_id, picture_id, like_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const response = await client.query(SQL, [user_id, picture_id, like_id]);
  return response.rows[0];
};

//--fetches all comments associated with a specific picture and user--
const fetchAllLinkCommentPictureAndUser = async () => {
  const SQL = `
    SELECT * FROM comments_x_pictures_x_users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//--fetches all comments associated with aspecific users and pictures--
const fetchAllLinkLikePictureAndUser = async () => {
  const SQL = `
    SELECT * FROM likes_x_pictures_x_users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  createPicture,
  linkUserToPicture,
  fetchUsers,
  fetchPictures,
  fetchUserPictures,
  fetchUserPictureLinks,
  deleteUser,
  deletePicture,
  deleteUserPictureLink,
  fetchFeed,
  createComment,
  createLike,
  deleteComment,
  deleteLike,
  linkCommentPictureAndUser,
  linkLikePictureAndUser,
  fetchAllLinkCommentPictureAndUser,
  fetchAllLinkLikePictureAndUser,
  fetchUserPicturesByUsername,
  fetchPictureById,
  fetchPictureByUsernameAndId,
};
