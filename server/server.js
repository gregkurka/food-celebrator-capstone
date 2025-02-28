require("dotenv").config();
const cors = require("cors");
const imgur = require("imgur");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

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

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

app.post("/api/upload", upload.single("image"), async (req, res, next) => {
  console.log("REQUEST RECEIVED AT /api/upload");
  const messages = [];

  try {
    console.log("Checking for file in request...");
    if (!req.file) {
      messages.push("No image provided.");
      return res
        .status(400)
        .json({ error: "No image provided", logs: messages });
    }

    console.log("Extracting token from header...");
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      messages.push("Unauthorized: No token provided.");
      return res
        .status(401)
        .json({ error: "Unauthorized: No token provided", logs: messages });
    }

    console.log("Finding user by token...");
    let user;
    try {
      user = await findUserByToken(token);
    } catch (err) {
      messages.push("Unauthorized: Invalid token.");
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid token", logs: messages });
    }

    console.log("Running face detection...");
    const [faceResult] = await visionClient.faceDetection(req.file.buffer);
    if (faceResult.faceAnnotations && faceResult.faceAnnotations.length > 0) {
      messages.push("Face detected, rejecting image.");
      return res
        .status(400)
        .json({
          error: "This image contains a person (face detected).",
          logs: messages,
        });
    }

    console.log("Running object localization...");
    const [objectResult] = await visionClient.objectLocalization(
      req.file.buffer
    );
    const personDetected = objectResult.localizedObjectAnnotations.some(
      (obj) => obj.name.toLowerCase() === "person"
    );
    if (personDetected) {
      messages.push("Person object detected, rejecting image.");
      return res
        .status(400)
        .json({
          error: "This image contains a person (object detected).",
          logs: messages,
        });
    }

    console.log("Running label detection...");
    const [visionResult] = await visionClient.labelDetection(req.file.buffer);
    const MIN_CONFIDENCE = 0.8;
    const detectedLabels = visionResult.labelAnnotations
      .filter((label) => label.score >= MIN_CONFIDENCE)
      .map((label) => label.description.toLowerCase());

    detectedLabels.forEach((label) => {
      const isAllowed = ALLOWED_LABELS.some((allowed) =>
        label.includes(allowed)
      );
      messages.push(
        `Detected label: "${label}" - ${isAllowed ? "PASSED" : "REJECTED"}`
      );
    });

    const allowedMatches = detectedLabels.filter((label) =>
      ALLOWED_LABELS.some((allowed) => label.includes(allowed))
    );
    const ratio = allowedMatches.length / (detectedLabels.length || 1);

    if (ratio < 0.6 || allowedMatches.length < 2) {
      messages.push(
        `Upload rejected. Ratio: ${ratio.toFixed(2)}; Allowed matches: ${
          allowedMatches.length
        }`
      );
      return res
        .status(400)
        .json({
          error: "This image contains disallowed items.",
          logs: messages,
        });
    }

    messages.push(
      `Upload accepted. Ratio: ${ratio.toFixed(2)}; Allowed matches: ${
        allowedMatches.length
      }`
    );

    console.log("Saving image to a temporary file...");
    const tempFilePath = path.join(__dirname, "temp_upload.jpg");
    fs.writeFileSync(tempFilePath, req.file.buffer);

    console.log("Uploading image to www.gregkurka.com...");
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempFilePath));

    let uploadResponse;
    try {
      uploadResponse = await axios.post(
        "https://www.gregkurka.com/upload.php",
        formData,
        {
          headers: { ...formData.getHeaders() },
        }
      );
    } catch (error) {
      console.error(
        "Error uploading to Namecheap server:",
        error.response?.data || error.message
      );
      return res
        .status(500)
        .json({ error: "Failed to upload to server.", logs: messages });
    } finally {
      fs.unlinkSync(tempFilePath);
    }

    if (!uploadResponse.data || uploadResponse.data.status !== "success") {
      return res
        .status(500)
        .json({ error: "Upload failed on server side.", logs: messages });
    }

    const imageUrl = uploadResponse.data.url;
    console.log("Image uploaded successfully. URL:", imageUrl);

    const caption = req.body.caption || "";
    console.log(
      "Creating picture record with URL:",
      imageUrl,
      "and caption:",
      caption
    );
    const newPicture = await createPicture({ URL: imageUrl, caption });

    console.log("Linking picture to user...");
    await linkUserToPicture({ user_id: user.id, picture_id: newPicture.id });

    console.log("Responding with success.");
    return res
      .status(201)
      .json({
        message: "Upload successful",
        picture: newPicture,
        logs: messages,
      });
  } catch (err) {
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

//updates Bio
app.put("/api/:username/bio", async (req, res, next) => {
  try {
    const { username } = req.params;
    const { updatedBio } = req.body;

    // First, find the user’s ID by username
    const getUserSQL = `SELECT id FROM users WHERE username = $1;`;
    const userRes = await client.query(getUserSQL, [username]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = userRes.rows[0].id;

    // Then, use your helper to update the profile pic number by userId
    const updated = await editBioByUserId(userId, updatedBio);
    res.json(updated); // updated should include the new profile_pic_num
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
