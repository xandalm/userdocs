import express from "express";
import UserController from "./controllers/user.controller";
import { CreateUserDAO, UserStorage } from "./models/user.model";

class StubStorage implements UserStorage {
  CreateUser(email: string, name: string): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt?: Date; deletedAt?: Date; }> {
    return Promise.resolve({
      id: 1,
      email: email,
      name: name,
      createdAt: new Date,
    })
  }
  UpdateUser(id: number, set: {email?: string, name?: string}): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt: Date; deletedAt?: Date; }> {
    throw new Error("Method not implemented.");
  }
  DeleteUser(id: number): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt?: Date; deletedAt: Date; }> {
    throw new Error("Method not implemented.");
  }
  GetUser(id: number): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt?: Date; deletedAt?: Date; }> {
    throw new Error("Method not implemented.");
  }
  GetActiveUsers(page: number, pageSize: number): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt?: Date; deletedAt?: Date; }[]> {
    throw new Error("Method not implemented.");
  }
}

// Storage

const storage: UserStorage = new StubStorage

// DAOs

const userDao = CreateUserDAO(storage)

// Controllers

const userCtrl = new UserController(userDao)

// Routes

const UserRoutes = express.Router()

UserRoutes.post("/", userCtrl.Post.bind(userCtrl))

// App

const app = express()

app.use(express.json())
app.use("/users", UserRoutes)

export default app
