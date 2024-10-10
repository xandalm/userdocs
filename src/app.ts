import express from "express";
import UserController from "./controllers/user.controller";
import { CreateUserDAO } from "./models/user.model";
import MemoryStorage from "./persistence/memory_storage";
import { CreateDocDAO } from "./models/docs.model";
import { CreateDocStatusDAO } from "./models/docstatus.model";
import DocController from "./controllers/doc.controller";

// Storage

const storage = new MemoryStorage()

// DAOs

const userDao = CreateUserDAO(storage)
const docDao = CreateDocDAO(storage)
const docStatusDao = CreateDocStatusDAO(storage)

// Controllers

const userCtrl = new UserController(userDao, docDao, docStatusDao)
const docCtrl = new DocController(userDao, docDao, docStatusDao)

// Routes

const UserRoutes = express.Router()

UserRoutes.param("userId", userCtrl.FindUser.bind(userCtrl))

UserRoutes.post("/", userCtrl.Post.bind(userCtrl))
UserRoutes.put("/:userId", userCtrl.Put.bind(userCtrl))
UserRoutes.get("/:userId", userCtrl.Get.bind(userCtrl))
UserRoutes.delete("/:userId", userCtrl.Delete.bind(userCtrl))
UserRoutes.get("/:userId/docs", userCtrl.GetDocs.bind(userCtrl))
UserRoutes.post("/:userId/doc", userCtrl.PostDoc.bind(userCtrl))

const DocRoutes = express.Router()

DocRoutes.param("docId", docCtrl.FindDoc.bind(userCtrl))

DocRoutes.post("/", docCtrl.Post.bind(docCtrl))
DocRoutes.put("/:docId", docCtrl.Put.bind(docCtrl))
DocRoutes.get("/:docId", docCtrl.Get.bind(docCtrl))
DocRoutes.delete("/:docId", docCtrl.Delete.bind(docCtrl))

// App

const app = express()

app.use(express.json())
app.use("/user", UserRoutes)
app.use("/doc", DocRoutes)

// app.get("/users", userCtrl.GetMany.bind(userCtrl))
// app.get("/docs", docCtrl.GetMany.bind(docCtrl))

export default app
