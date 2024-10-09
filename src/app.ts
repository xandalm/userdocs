import express from "express";
import UserController from "./controllers/user.controller";
import { CreateUserDAO } from "./models/user.model";
import MemoryStorage from "./persistence/memory_storage";

// Storage

const storage = new MemoryStorage()

// DAOs

const userDao = CreateUserDAO(storage)

// Controllers

const userCtrl = new UserController(userDao)

// Routes

const UserRoutes = express.Router()

UserRoutes.get("/:id", userCtrl.Get.bind(userCtrl))
UserRoutes.get("/", userCtrl.GetMany.bind(userCtrl))
UserRoutes.post("/", userCtrl.Post.bind(userCtrl))
UserRoutes.put("/:id", userCtrl.Put.bind(userCtrl))
UserRoutes.delete("/:id", userCtrl.Delete.bind(userCtrl))

// App

const app = express()

app.use(express.json())
app.use("/users", UserRoutes)

export default app
