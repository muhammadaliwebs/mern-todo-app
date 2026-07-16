import express from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3200;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(
  cors({
    origin: "https://mern-todo-app-me.netlify.app",
    credentials: true,
  }),
);
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  console.log("verify", req.cookies["token"]);
  const token = req.cookies["token"];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.send({
        message: "Unauthorized",
        success: false,
      });
    } else {
      next();
    }
  });
};

// Add Task wali API:
app.post("/add-task", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(req.body);
  if (result) {
    res.send({
      message: "Task added successfully",
      success: true,
    });
  } else {
    res.send({
      message: "Task not added",
      success: false,
    });
  }
});

// Get Tasks wali API:
app.get("/tasks-list", verifyToken, async (req, res) => {
  console.log("cookies", req.cookies["token"]);
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find().toArray();
  if (result) {
    res.send({
      message: "Tasks fetched successfully",
      success: true,
      data: result,
    });
  } else {
    res.send({
      message: "No tasks found",
      success: false,
    });
  }
});

// Delete Task wali API:
app.delete("/delete-task/:id", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  if (result) {
    res.send({
      message: "Task deleted successfully",
      success: true,
      data: result,
    });
  } else {
    res.send({
      message: "Task not deleted",
      success: false,
    });
  }
});

// Delete Multiple Tasks wali API:
app.delete("/delete-multiple/", verifyToken, async (req, res) => {
  const db = await connection();
  const ids = req.body;
  console.log(ids);
  const collection = db.collection(collectionName);
  const objectIds = ids.map((id) => new ObjectId(id));
  const result = await collection.deleteMany({ _id: { $in: objectIds } });
  if (result) {
    res.send({
      message: "Task deleted successfully",
      success: true,
      data: result,
    });
  } else {
    res.send({
      message: "Task not deleted",
      success: false,
    });
  }
});

// Populate Data wali API:
app.get("/tasks/:id", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
  if (result) {
    res.send({
      message: "Task fetched successfully",
      success: true,
      data: result,
    });
  } else {
    res.send({
      message: "Task not found",
      success: false,
    });
  }
});
// Update Task wali API:
app.put("/update-task/", verifyToken, async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.updateOne(
    { _id: new ObjectId(req.body.id) },
    { $set: { title: req.body.title, description: req.body.description } },
  );
  console.log(req.body);
  if (result) {
    res.send({
      message: "Task updated successfully",
      success: true,
      data: result,
    });
  } else {
    res.send({
      message: "Task not updated",
      success: false,
    });
  }
});

// Signup wali API:
app.post("/signup", async (req, res) => {
  const userData = req.body;
  if (!userData.email || !userData.name || !userData.password) {
    res.send({
      message: "Please enter all required fields",
      success: false,
    });
    return;
  }
  const db = await connection();
  const collection = db.collection("users");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const result = await collection.insertOne({
    ...userData,
    password: hashedPassword,
  });

  if (result) {
    const tokenPayload = { email: userData.email, name: userData.name };
    jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "10d" }, (err, token) => {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.send({
        message: "User added successfully",
        success: true,
        token: token,
      });
    });
  } else {
    res.send({
      message: "Signup failed",
      success: false,
    });
  }
});
// Login wali API:
app.post("/login", async (req, res) => {
  const userData = req.body;
  if (!userData.email || !userData.password) {
    res.send({
      message: "Please enter email and password",
      success: false,
    });
    return;
  }
  const db = await connection();
  const collection = db.collection("users");
  const result = await collection.findOne({
    email: userData.email,
  });

  const isMatch =
    result && (await bcrypt.compare(userData.password, result.password));

  if (isMatch) {
    const tokenPayload = { email: result.email, name: result.name };
    jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "10d" }, (err, token) => {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.send({
        message: "User logged in successfully",
        success: true,
        token: token,
      });
    });
  } else {
    res.send({
      message: "Invalid email or password",
      success: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// import express from "express";
// import { collectionName, connection } from "./dbconfig.js";
// import cors from "cors";
// import { ObjectId } from "mongodb";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// const app = express();
// const PORT = 3200;

// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );
// app.use(cookieParser());

// const verifyToken = (req, res, next) => {
//   console.log("verify", req.cookies["token"]);
//   const token = req.cookies["token"];
//   jwt.verify(token, "Google", (err, decoded) => {
//     if (err) {
//       res.send({
//         message: "Unauthorized",
//         success: false,
//       });
//     } else {
//       next();
//     }
//   });
// };

// // Add Task wali API:
// app.post("/add-task", verifyToken, async (req, res) => {
//   const db = await connection();
//   const collection = db.collection(collectionName);
//   const result = await collection.insertOne(req.body);
//   if (result) {
//     res.send({
//       message: "Task added successfully",
//       success: true,
//     });
//   } else {
//     res.send({
//       message: "Task not added",
//       success: false,
//     });
//   }
// });

// // Get Tasks wali API:
// app.get("/tasks-list", verifyToken, async (req, res) => {
//   console.log("cookies", req.cookies["token"]);
//   const db = await connection();
//   const collection = db.collection(collectionName);
//   const result = await collection.find().toArray();
//   if (result) {
//     res.send({
//       message: "Tasks fetched successfully",
//       success: true,
//       data: result,
//     });
//   } else {
//     res.send({
//       message: "No tasks found",
//       success: false,
//     });
//   }
// });

// // Delete Task wali API:
// app.delete("/delete-task/:id", verifyToken, async (req, res) => {
//   const db = await connection();
//   const collection = db.collection(collectionName);
//   const result = await collection.deleteOne({
//     _id: new ObjectId(req.params.id),
//   });
//   if (result) {
//     res.send({
//       message: "Task deleted successfully",
//       success: true,
//       data: result,
//     });
//   } else {
//     res.send({
//       message: "Task not deleted",
//       success: false,
//     });
//   }
// });

// // Delete Multiple Tasks wali API:
// app.delete("/delete-multiple/", verifyToken, async (req, res) => {
//   const db = await connection();
//   const ids = req.body;
//   console.log(ids);
//   const collection = db.collection(collectionName);
//   const objectIds = ids.map((id) => new ObjectId(id));
//   const result = await collection.deleteMany({ _id: { $in: objectIds } });
//   if (result) {
//     res.send({
//       message: "Task deleted successfully",
//       success: true,
//       data: result,
//     });
//   } else {
//     res.send({
//       message: "Task not deleted",
//       success: false,
//     });
//   }
// });

// // Populate Data wali API:
// app.get("/tasks/:id", verifyToken, async (req, res) => {
//   const db = await connection();
//   const collection = db.collection(collectionName);
//   const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
//   if (result) {
//     res.send({
//       message: "Task fetched successfully",
//       success: true,
//       data: result,
//     });
//   } else {
//     res.send({
//       message: "Task not found",
//       success: false,
//     });
//   }
// });
// // Update Task wali API:
// app.put("/update-task/", verifyToken, async (req, res) => {
//   const db = await connection();
//   const collection = db.collection(collectionName);
//   const result = await collection.updateOne(
//     { _id: new ObjectId(req.body.id) },
//     { $set: { title: req.body.title, description: req.body.description } },
//   );
//   console.log(req.body);
//   if (result) {
//     res.send({
//       message: "Task updated successfully",
//       success: true,
//       data: result,
//     });
//   } else {
//     res.send({
//       message: "Task not updated",
//       success: false,
//     });
//   }
// });

// // Signup wali API:
// app.post("/signup", async (req, res) => {
//   const userData = req.body;
//   if (!userData.email || !userData.name || !userData.password) {
//     res.send({
//       message: "Please enter all required fields",
//       success: false,
//     });
//     return;
//   }
//   const db = await connection();
//   const collection = db.collection("users");
//   const result = await collection.insertOne(userData);
//   if (result) {
//     jwt.sign(userData, "Google", { expiresIn: "10d" }, (err, token) => {
//       console.log(userData);
//       res.send({
//         message: "User added successfully",
//         success: true,
//         token: token,
//       });
//     });
//   } else {
//     res.send({
//       message: "Signup failed",
//       success: false,
//     });
//   }
// });
// // Login wali API:
// app.post("/login", async (req, res) => {
//   const userData = req.body;
//   if (!userData.email || !userData.password) {
//     res.send({
//       message: "Please enter email and password",
//       success: false,
//     });
//     return;
//   }
//   const db = await connection();
//   const collection = db.collection("users");
//   const result = await collection.findOne({
//     email: userData.email,
//     password: userData.password,
//   });
//   if (result) {
//     jwt.sign(userData, "Google", { expiresIn: "10d" }, (err, token) => {
//       console.log(userData);
//       res.send({
//         message: "User logged in successfully",
//         success: true,
//         token: token,
//       });
//     });
//   } else {
//     res.send({
//       message: "Invalid email or password",
//       success: false,
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
