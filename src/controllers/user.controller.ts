import { Request, Response } from "express"
import { User, UserDAO, UserFactory } from "../models/user.model"

const EmailRegExp = /^(\w+)([-\.]?\w+)*@(\w+\.)+(\w+)$/;
function isValidEmail(v: string) : boolean {
  return EmailRegExp.test(v)
}

interface UserViewModel {
  id: number
  email: string
  name: string
  createdAt: string
  updatedAt?: string
  // deletedAt?: string
}

function userViewModel(user: User): UserViewModel {
  let data: UserViewModel = {
    id: user.Id(),
    email: user.Email(),
    name: user.Name(),
    createdAt: user.CreatedAt().toISOString(),
  }
  if (user.UpdatedAt() !== null) {
    data.updatedAt = (user.UpdatedAt() as Date).toISOString()
  }
  // if (user.DeletedAt() !== null) {
  //   data.deletedAt = (user.DeletedAt() as Date).toISOString()
  // }
  return data
}

export default class UserController {
  private userDao: UserDAO
  constructor(userDao: UserDAO) {
    this.userDao = userDao
  }
  async Post(req: Request, res: Response) {
    let { email, name } = req.body;
    let alerts: string[] = []

    if ((typeof email !== "string") || !isValidEmail(email)) {
      alerts.push("invalid email")
    }
    if ((typeof name !== "string") || name.length < 2) {
      alerts.push("invalid name")
    }
    
    if (alerts.length > 0) {
      res.status(400).json({errors: alerts})
      return
    }

    let user = UserFactory.CreateUser(email, name)

    this.userDao.Create(user)
    .then(() => {
      res.status(201).json(userViewModel(user))
    })
    .catch(err => {
      switch(err) {
        default:
          res.status(500)
      }
      res.send()
    })
  }
  async GetById(req: Request, res: Response) {
    let {id} = req.params

    this.userDao.Select(parseInt(id))
      .then(user => {
        if (user == null) {
          res.status(404).send()
          return
        } 
        res.status(200).json(userViewModel(user))
      })
      .catch(err => {
        switch(err) {
          default:
            res.status(500)
        }
        res.send()
      })
  }
  async Put(req: Request, res: Response) {
    let {id} = req.params
    let input = req.body
    let alerts = new Array<string>

    let user: User|null
    try {
      user = await this.userDao.Select(parseInt(id))
    } catch(err) {
      switch(err) {
        default:
          res.status(500).send()
      }
      res.send()
      return
    }

    if (user == null) {
      res.status(404).send()
      return
    }

    if (input.hasOwnProperty("email")) {
      const email = input.email
      if ((typeof email !== "string") || !isValidEmail(email))
        alerts.push("invalid email")
    }
    if (input.hasOwnProperty("name")) {
      const name = input.name
      if ((typeof name !== "string") || name.length < 2)
        alerts.push("invalid name")
    }

    if (alerts.length > 0) {
      res.status(400).json({errors: alerts})
      return
    }

    this.userDao.Update(user, input)
      .then(() => {
        res.status(200).json(userViewModel(user))
      })
      .catch(err => {
        switch(err) {
          default:
            res.status(500)
        }
        res.send()
      })
  }
  async Delete(req: Request, res: Response) {
    throw new Error("Method not implemented.")
  }
}
