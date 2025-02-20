require("dotenv").config();

const {
  client,
  createTables,
  createUser,
  createPicture,
  linkUserToPicture,
  fetchUsers,
  fetchPictures,
  fetchUserPictures,
  deleteUser,
  deletePicture,
  deleteUserPictureLink,
} = require("./db");

const seed = async () => {
  try {
    console.log(client);
    // separate connection to DB since this file will run separately from index.js
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to database.");

    await createTables();
    console.log("Tables created.");

    // Seed data if you'd like
    const user1 = await createUser({
      username: "gregk",
      password: "pw_gregk",
      email: "test1@example.com",
    });
    const user2 = await createUser({
      username: "ericr",
      password: "pw_ericr",
      email: "test2@example.com",
    });
    const user3 = await createUser({
      username: "biknah",
      password: "pw_biknah",
      email: "test3@example.com",
    });
    const user4 = await createUser({
      username: "mikew",
      password: "pw_mikew",
      email: "test4@example.com",
    });
    const user5 = await createUser({
      username: "zachs",
      password: "pw_zachs",
      email: "test5@example.com",
    });

    const picture1 = await createPicture({
      URL: "https://example.com/image1.jpg",
      caption: "A beautiful sunset.",
    });
    const picture2 = await createPicture({
      URL: "https://example.com/image2.jpg",
      caption: "A mountain view.",
    });

    await linkUserToPicture({ user_id: user1.id, picture_id: picture1.id });
    await linkUserToPicture({ user_id: user2.id, picture_id: picture2.id });

    console.log("Data seeded.");
  } catch (error) {
    console.log(error);
  }
};

seed();
