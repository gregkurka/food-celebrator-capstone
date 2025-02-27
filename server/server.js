require("dotenv").config();
const cors = require("cors");
const imgur = require("imgur");
const multer = require("multer");
const axios = require("axios");

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
  fetchUserPictureLinks,
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
  editBioByUserId,
  fetchBioByUsername,
  setProfilePicNumByUserId,
} = require("./db");

const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
app.use(express.json());
const upload = multer();

//google vision imports
const { ImageAnnotatorClient } = require("@google-cloud/vision");
const visionClient = new ImageAnnotatorClient();
const ALLOWED_LABELS = require("./allowedLabels");

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://foodcelebrator.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const path = require("path");

const { authenticate, findUserByToken, isLoggedIn } = require("./auth");

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).send(newUser);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", isLoggedIn, async (req, res, next) => {
  try {
    const user = await findUserByToken(req.headers.authorization);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});
app.post("/api/users", async (req, res, next) => {
  try {
    res.status(201).send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/pictures", async (req, res, next) => {
  try {
    res.status(201).send(await createPicture(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:userId/pictures/:pictureId", async (req, res, next) => {
  try {
    res.status(201).send(
      await linkUserToPicture({
        user_id: req.params.userId,
        picture_id: req.params.pictureId,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/pictures", async (req, res, next) => {
  try {
    res.send(await fetchPictures());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/pictures/:pictureId", async (req, res, next) => {
  try {
    res.send(await fetchPictureById(req.params.pictureId));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:userId/pictures", async (req, res, next) => {
  try {
    res.send(await fetchUserPictures(req.params.userId));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/username/:username/pictures", async (req, res, next) => {
  try {
    res.send(await fetchUserPicturesByUsername(req.params.username));
  } catch (ex) {
    next(ex);
  }
});

app.get(
  "/api/username/:username/pictures/:pictureid",
  async (req, res, next) => {
    try {
      res.send(
        await fetchPictureByUsernameAndId({
          username: req.params.username,
          picture_id: req.params.pictureid,
        })
      );
    } catch (ex) {
      next(ex);
    }
  }
);

app.get("/api/users_x_pictures", async (req, res, next) => {
  try {
    res.send(await fetchUserPictureLinks());
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:id", async (req, res, next) => {
  try {
    res.send(await deleteUser(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/pictures/:id", async (req, res, next) => {
  try {
    res.send(await deletePicture(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:userId/pictures/:pictureId", async (req, res, next) => {
  try {
    res.send(
      await deleteUserPictureLink({
        user_id: req.params.userId,
        picture_id: req.params.pictureId,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({ error: err.message || err });
});

app.get("/api/feed", async (req, res, next) => {
  try {
    res.send(await fetchFeed());
  } catch (ex) {
    next(ex);
  }
});

//--Ingur image upload--

app.post("/api/upload", upload.single("image"), async (req, res, next) => {
  console.log("REQUEST RECEIVED AT /api/upload");
  // We'll collect logs here to return in the response
  const messages = [];

  try {
    // 1) Ensure a file was provided
    console.log("Checking for file in request...");
    if (!req.file) {
      messages.push("No image provided.");
      console.log("No image provided in request.");
      return res.status(400).json({
        error: "No image provided",
        logs: messages,
      });
    }

    // 2) Extract token from Authorization header
    console.log("Extracting token from header:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      messages.push("Unauthorized: No token provided.");
      console.log("No token provided, returning 401");
      return res.status(401).json({
        error: "Unauthorized: No token provided",
        logs: messages,
      });
    }

    // 3) Find user by token
    console.log("Finding user by token...");
    let user;
    try {
      user = await findUserByToken(token);
      console.log("User found:", user);
    } catch (err) {
      messages.push("Unauthorized: Invalid token.");
      console.log("Invalid token:", err.message);
      return res.status(401).json({
        error: "Unauthorized: Invalid token",
        logs: messages,
      });
    }

    // 4) Face Detection: Reject if any face is detected
    console.log("Running face detection...");
    const [faceResult] = await visionClient.faceDetection(req.file.buffer);
    console.log("Face detection result:", faceResult);
    if (faceResult.faceAnnotations && faceResult.faceAnnotations.length > 0) {
      messages.push("Face detected, rejecting image.");
      console.log("Face detected, returning 400");
      return res.status(400).json({
        error: "This image contains a person (face detected).",
        logs: messages,
      });
    }

    // 5) Object Localization: Reject if any 'person' object is detected
    console.log("Running object localization...");
    const [objectResult] = await visionClient.objectLocalization(
      req.file.buffer
    );
    console.log("Object localization result:", objectResult);
    const personDetected = objectResult.localizedObjectAnnotations.some(
      (obj) => obj.name.toLowerCase() === "person"
    );
    if (personDetected) {
      messages.push("Person object detected, rejecting image.");
      console.log("Person detected in image, returning 400");
      return res.status(400).json({
        error: "This image contains a person (object detected).",
        logs: messages,
      });
    }

    // 6) Label Detection: Check for allowed food-related labels
    console.log("Running label detection...");
    const [visionResult] = await visionClient.labelDetection(req.file.buffer);
    console.log("Label detection result:", visionResult);

    // Extract labels with confidence score filtering (0.80+)
    const MIN_CONFIDENCE = 0.8;
    const detectedLabels = visionResult.labelAnnotations
      .filter((label) => label.score >= MIN_CONFIDENCE)
      .map((label) => label.description.toLowerCase());
    console.log("Detected labels (80%+ confidence):", detectedLabels);

    // For each label, determine if it is allowed or not and push a log
    detectedLabels.forEach((label) => {
      const isAllowed = ALLOWED_LABELS.some((allowed) =>
        label.includes(allowed)
      );
      messages.push(
        `Detected label: "${label}" - ${isAllowed ? "PASSED" : "REJECTED"}`
      );
    });

    // Count how many detected labels match our allowed list
    const allowedMatches = detectedLabels.filter((label) =>
      ALLOWED_LABELS.some((allowed) => label.includes(allowed))
    );
    console.log("Allowed label matches:", allowedMatches);

    // Calculate ratio of allowed labels to total detected labels
    const ratio = allowedMatches.length / (detectedLabels.length || 1);
    console.log(`Ratio of allowed to total: ${ratio}`);

    // Stricter check: require at least 60% of these labels be allowed
    // and at least 2 allowed labels overall.
    if (ratio < 0.6 || allowedMatches.length < 2) {
      messages.push(
        `Upload rejected. Ratio: ${ratio.toFixed(2)}; Allowed matches: ${
          allowedMatches.length
        }`
      );
      console.log(
        "Rejecting image due to ratio or insufficient allowed matches"
      );
      return res.status(400).json({
        error: "This image contains disallowed items.",
        logs: messages,
      });
    }

    messages.push(
      `Upload accepted. Ratio: ${ratio.toFixed(2)}; Allowed matches: ${
        allowedMatches.length
      }`
    );
    console.log("Image passed label checks, continuing...");

    // 7) Convert the image buffer to a base64 string
    console.log("Converting image to base64...");
    const base64Image = req.file.buffer.toString("base64");

    // 8) Upload the image to Imgur
    console.log(
      "Uploading to Imgur with Client-ID:",
      process.env.IMGUR_ACCESS_TOKEN
    );
    let imgurResponse;
    try {
      imgurResponse = await axios.post(
        "https://api.imgur.com/3/image",
        { image: base64Image, type: "base64" },
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_ACCESS_TOKEN}`,
          },
        }
      );
      console.log(
        "Imgur response status:",
        imgurResponse.status,
        " data:",
        imgurResponse.data
      );
    } catch (imgurError) {
      console.log(
        "Error uploading to Imgur:",
        imgurError.response?.data || imgurError.message
      );
      throw imgurError; // This will go to the catch block below
    }

    const imageUrl = imgurResponse.data.data.link;
    console.log("Image uploaded to Imgur. URL:", imageUrl);

    // 9) Create a picture in the DB using the returned URL and caption
    const caption = req.body.caption || "";
    console.log(
      "Creating picture record with URL:",
      imageUrl,
      "and caption:",
      caption
    );
    const newPicture = await createPicture({ URL: imageUrl, caption });
    console.log("New picture created with ID:", newPicture.id);

    // 10) Link the picture to the authenticated user
    console.log("Linking picture to user with ID:", user.id);
    await linkUserToPicture({ user_id: user.id, picture_id: newPicture.id });
    console.log("Picture linked to user successfully.");

    // 11) Respond with success, including logs
    console.log("Responding with success. messages:", messages);
    return res.status(201).json({
      message: "Upload successful",
      picture: newPicture,
      logs: messages,
    });
  } catch (err) {
    // If something unexpected happens, log it and return a server error
    console.log("Unexpected error in upload handler:", err);
    messages.push(`Unexpected error: ${err.message}`);
    return next({
      status: 500,
      message: "Internal server error",
      logs: messages,
    });
  }
});

// Create a comment on a picture
app.post("/api/createComment", async (req, res, next) => {
  try {
    const { user_id, picture_id, content } = req.body;
    const newComment = await createComment({ content });
    await linkCommentPictureAndUser({
      user_id,
      picture_id,
      comment_id: newComment.id,
    });
    res.status(201).json({ message: "Comment created", comment: newComment });
  } catch (ex) {
    next(ex);
  }
});
// Edit a comment
app.put("/api/editComment", async (req, res, next) => {
  try {
    const { comment_id, content } = req.body;
    const SQL = `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *;`;
    const response = await client.query(SQL, [content, comment_id]);
    res.json(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});
// Delete a comment
app.delete("/api/deleteComment", async (req, res, next) => {
  try {
    const { comment_id } = req.body;
    res.json(await deleteComment(comment_id));
  } catch (ex) {
    next(ex);
  }
});
// Create a like on a picture
app.post("/api/createLike", async (req, res, next) => {
  try {
    const { user_id, picture_id } = req.body;
    const newLike = await createLike();
    await linkLikePictureAndUser({
      user_id,
      picture_id,
      like_id: newLike.id,
    });
    res.status(201).json({ message: "Like added", like: newLike });
  } catch (ex) {
    next(ex);
  }
});
// Delete a like
app.delete("/api/deleteLike", async (req, res, next) => {
  try {
    const { like_id } = req.body;
    res.json(await deleteLike(like_id));
  } catch (ex) {
    next(ex);
  }
});
// Fetch all likes on a picture
app.get("/api/:pictureId/likes", async (req, res, next) => {
  try {
    const pictureId = req.params.pictureId;
    const SQL = `
      SELECT 
        users.id AS user_id, 
        users.username, 
        likes_x_pictures_x_users.like_id,
        likes_x_pictures_x_users.created_at
      FROM likes_x_pictures_x_users
      JOIN users ON likes_x_pictures_x_users.user_id = users.id
      WHERE picture_id = $1;
`;
    const response = await client.query(SQL, [pictureId]);
    res.json(response.rows);
  } catch (ex) {
    next(ex);
  }
});
// Fetch all comments on a picture
app.get("/api/:pictureId/comments", async (req, res, next) => {
  try {
    const pictureId = req.params.pictureId;
    const SQL = `
        SELECT users.id AS user_id, 
        users.username, 
        comments.content, 
        comments_x_pictures_x_users.comment_id,
        comments_x_pictures_x_users.created_at
        FROM comments_x_pictures_x_users
        JOIN comments ON comments_x_pictures_x_users.comment_id = comments.id
        JOIN users ON comments_x_pictures_x_users.user_id = users.id
        WHERE picture_id = $1;
      `;
    const response = await client.query(SQL, [pictureId]);
    res.json(response.rows);
  } catch (ex) {
    next(ex);
  }
});

//BIO AND PROFILE PICS

//returns bio by username
app.put("/api/:username/bio", async (req, res, next) => {
  try {
    const { username } = req.params;
    const { bio } = req.body;

    // First, see if there's a user with this username
    const userBioRow = await fetchBioByUsername(username);
    if (!userBioRow) {
      return res.status(404).send({ error: "User not found" });
    }

    const userId = userBioRow.id; // adjust if your function returns the full user row
    const updated = await editBioByUserId(userId, bio);

    res.send(updated);
  } catch (err) {
    next(err);
  }
});

// Fetch user’s bio by username
app.get("/api/:username/bio", async (req, res, next) => {
  try {
    const { username } = req.params;
    const userBio = await fetchBioByUsername(username);
    if (!userBio) {
      return res.status(404).json({ error: "User not found" });
    }
    // userBio might be an object like { bio: '...' }
    res.json(userBio);
  } catch (err) {
    next(err);
  }
});

// Fetch user’s profile_pic_num by username
app.get("/api/:username/profilepic", async (req, res, next) => {
  try {
    const { username } = req.params;
    const SQL = `
      SELECT profile_pic_num 
      FROM users 
      WHERE username = $1
    `;
    const response = await client.query(SQL, [username]);
    if (response.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return the number only or an object—your choice:
    res.json({ profile_pic_num: response.rows[0].profile_pic_num });
  } catch (err) {
    next(err);
  }
});

// Update user’s profile_pic_num by username
app.put("/api/:username/profilepic", async (req, res, next) => {
  try {
    const { username } = req.params;
    const { profile_pic_num } = req.body;

    // First, find the user’s ID by username
    const getUserSQL = `SELECT id FROM users WHERE username = $1;`;
    const userRes = await client.query(getUserSQL, [username]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = userRes.rows[0].id;

    // Then, use your helper to update the profile pic number by userId
    const updated = await setProfilePicNumByUserId(userId, profile_pic_num);
    res.json(updated); // updated should include the new profile_pic_num
  } catch (err) {
    next(err);
  }
});

const init = async () => {
  try {
    console.log("Starting server...");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};
init();
