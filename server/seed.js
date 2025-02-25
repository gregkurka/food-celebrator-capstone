// seed.js
require("dotenv").config();
const { Client } = require("pg");

// Import only the functions needed for seeding, NOT the shared client
const {
  createTables,
  createUser,
  createPicture,
  linkUserToPicture,
  // ...any other functions you need
} = require("./db");

// We'll define our own client (seedClient) just for seeding:
const seedClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const pictureUrl = "/demophotos/";

const seed = async () => {
  try {
    console.log("Connecting to database (seed script)...");
    await seedClient.connect();
    console.log("Connected to database (seed script).");

    // 1) Create all tables
    await createTables();
    console.log("Tables created.");

    // 2) Create seed users
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

    // 3) Create seed pictures
    const picture1 = await createPicture({
      URL: `${pictureUrl}picture1.png`,
      caption: "Salmon",
    });
    const picture2 = await createPicture({
      URL: `${pictureUrl}picture2.png`,
      caption: "Mac and Cheese",
    });
    const picture3 = await createPicture({
      URL: `${pictureUrl}picture3.png`,
      caption: "Sausages",
    });
    const picture4 = await createPicture({
      URL: `${pictureUrl}picture4.png`,
      caption: "Bread and Cheese",
    });
    const picture5 = await createPicture({
      URL: `${pictureUrl}picture5.png`,
      caption: "and dessert",
    });
    const picture6 = await createPicture({
      URL: `${pictureUrl}picture6.png`,
      caption: "so many desserts",
    });
    const picture7 = await createPicture({
      URL: `${pictureUrl}picture7.png`,
      caption: "Lots of dessert",
    });
    const picture8 = await createPicture({
      URL: `${pictureUrl}picture8.png`,
      caption: "Dessert also",
    });
    const picture9 = await createPicture({
      URL: `${pictureUrl}picture9.png`,
      caption: "Dessert",
    });
    const picture10 = await createPicture({
      URL: `${pictureUrl}picture10.png`,
      caption: "Meat",
    });
    const picture11 = await createPicture({
      URL: `${pictureUrl}picture11.png`,
      caption: "Unsure but its pretty",
    });
    const picture12 = await createPicture({
      URL: `${pictureUrl}picture12.png`,
      caption: "Is that a fat scallop?",
    });
    const picture13 = await createPicture({
      URL: `${pictureUrl}picture13.png`,
      caption: "Filet O Fish",
    });
    const picture14 = await createPicture({
      URL: `${pictureUrl}picture14.png`,
      caption: "Shrimp or Lobster or something",
    });
    const picture15 = await createPicture({
      URL: `${pictureUrl}picture15.png`,
      caption: "Salmon",
    });
    const picture16 = await createPicture({
      URL: `${pictureUrl}picture16.png`,
      caption: "Sushi",
    });
    const picture17 = await createPicture({
      URL: `${pictureUrl}picture17.png`,
      caption: "Moar Sushi",
    });
    const picture18 = await createPicture({
      URL: `${pictureUrl}picture18.png`,
      caption: "Shrimp",
    });
    const picture19 = await createPicture({
      URL: `${pictureUrl}picture19.png`,
      caption: "Food Ensemble",
    });
    const picture20 = await createPicture({
      URL: `${pictureUrl}picture20.png`,
      caption: "Potatoes",
    });
    const picture21 = await createPicture({
      URL: `${pictureUrl}picture21.png`,
      caption: "Meat and Vegetables",
    });
    const picture22 = await createPicture({
      URL: `${pictureUrl}picture22.png`,
      caption: "Meat and Potatoes",
    });
    const picture23 = await createPicture({
      URL: `${pictureUrl}picture23.png`,
      caption: "Rice Mix",
    });
    const picture24 = await createPicture({
      URL: `${pictureUrl}picture24.png`,
      caption: "Vermicelli",
    });
    const picture25 = await createPicture({
      URL: `${pictureUrl}picture25.png`,
      caption: "Salad",
    });

    // 4) Link users to pictures
    await linkUserToPicture({ user_id: user1.id, picture_id: picture1.id });
    await linkUserToPicture({ user_id: user1.id, picture_id: picture2.id });
    await linkUserToPicture({ user_id: user1.id, picture_id: picture3.id });
    await linkUserToPicture({ user_id: user1.id, picture_id: picture4.id });
    await linkUserToPicture({ user_id: user1.id, picture_id: picture5.id });
    await linkUserToPicture({ user_id: user2.id, picture_id: picture6.id });
    await linkUserToPicture({ user_id: user2.id, picture_id: picture7.id });
    await linkUserToPicture({ user_id: user2.id, picture_id: picture8.id });
    await linkUserToPicture({ user_id: user2.id, picture_id: picture9.id });
    await linkUserToPicture({ user_id: user2.id, picture_id: picture10.id });
    await linkUserToPicture({ user_id: user3.id, picture_id: picture11.id });
    await linkUserToPicture({ user_id: user3.id, picture_id: picture12.id });
    await linkUserToPicture({ user_id: user3.id, picture_id: picture13.id });
    await linkUserToPicture({ user_id: user3.id, picture_id: picture14.id });
    await linkUserToPicture({ user_id: user3.id, picture_id: picture15.id });
    await linkUserToPicture({ user_id: user4.id, picture_id: picture16.id });
    await linkUserToPicture({ user_id: user4.id, picture_id: picture17.id });
    await linkUserToPicture({ user_id: user4.id, picture_id: picture18.id });
    await linkUserToPicture({ user_id: user4.id, picture_id: picture19.id });
    await linkUserToPicture({ user_id: user4.id, picture_id: picture20.id });
    await linkUserToPicture({ user_id: user5.id, picture_id: picture21.id });
    await linkUserToPicture({ user_id: user5.id, picture_id: picture22.id });
    await linkUserToPicture({ user_id: user5.id, picture_id: picture23.id });
    await linkUserToPicture({ user_id: user5.id, picture_id: picture24.id });
    await linkUserToPicture({ user_id: user5.id, picture_id: picture25.id });

    console.log("Data seeded.");

    // 5) Close the connection
    await seedClient.end();
    console.log("Database connection closed (seed script).");
  } catch (error) {
    console.error("Seeding error:", error);
    // Make sure to close the connection if there's an error
    await seedClient.end();
    process.exit(1);
  }
};

// Run the seed
seed();
