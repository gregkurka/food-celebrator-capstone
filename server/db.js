const pg = require("pg");
const client = new pg.Client();
const bcrypt = require("bcrypt");

const createTables = async () => {
  const SQL = `
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
  fetchFeed, // <-- New export
};
