import express from "express";
import UserController from "./controllers/user.controller";
import { CreateUserDAO, UserStorage } from "./models/user.model";
import MemoryStorage from "./persistence/memory_storage";

// Storage

const storage: UserStorage = new MemoryStorage()

// DAOs

const userDao = CreateUserDAO(storage)

// Controllers

const userCtrl = new UserController(userDao)

// Routes

const UserRoutes = express.Router()

UserRoutes.get("/:id", userCtrl.GetById.bind(userCtrl))
UserRoutes.post("/", userCtrl.Post.bind(userCtrl))
UserRoutes.put("/:id", userCtrl.Put.bind(userCtrl))

// App

const app = express()

app.use(express.json())
app.use("/users", UserRoutes)

export default app
