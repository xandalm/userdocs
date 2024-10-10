import { NextFunction, Request, Response } from "express"
import { User, UserDAO, UserFactory } from "../models/user.model"
import { Doc, DocDAO, DocFactory } from "../models/docs.model";
import { DocStatus, DocStatusDAO } from "../models/docstatus.model";

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
}

interface StatusViewModel {
  id: number
  name?: string
}

interface DocViewModel {
  id: number
  name: string
  statusId?: number
  status?: StatusViewModel
  createdAt: string
  updatedAt?: string
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
  return data
}

function docViewModel(doc: Doc, s?: DocStatus|null) : DocViewModel {
  let data: DocViewModel = {
    id: doc.Id(),
    name: doc.Name(),
    createdAt: doc.CreatedAt().toISOString(),
  }

  if (s == null) {
    data.statusId = doc.Status()
  } else {
    data.status = {
      id: s.Id(),
      name: s.Name()
    }
  }
  if (doc.UpdatedAt() !== null) {
    data.updatedAt = (doc.UpdatedAt() as Date).toISOString()
  }
  return data
}

// TODO
//
// Improve error handling in all methods
//
// GetMany
// - Search accordingly to query filters
// 
export default class UserController {
  private userDao: UserDAO
  private docDao: DocDAO
  private docStatusDao: DocStatusDAO
  constructor(userDao: UserDAO, docDao: DocDAO, docStatusDao: DocStatusDAO) {
    this.userDao = userDao;
    this.docDao = docDao;
    this.docStatusDao = docStatusDao
  }
  async FindUser(req: Request, res: Response, next: NextFunction, id: any) {
    try {
      let user = await this.userDao.Select(parseInt(id))
      if (user === null) {
        res.status(404).send()
        return
      }
      req.user = user
      next()
    } catch(err) {
      switch(err) {
        default:
          res.status(500).send()
      }
      res.send()
    }
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
  async Get(req: Request, res: Response) {
    let user = req.user
    res.status(200).json(userViewModel(user))
  }
  async GetMany(req: Request, res: Response) {
    this.userDao.SelectAll()
      .then(users => {
        res.status(200).json(users.map(user => userViewModel(user)))
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
    let input = req.body
    let alerts = new Array<string>

    let user = req.user
    if (input.hasOwnProperty("email")) {
      const email = input.email
      if ((typeof email !== "string") || !isValidEmail(email))
        alerts.push("invalid email");
      else
        user.SetEmail(email)
    }
    if (input.hasOwnProperty("name")) {
      const name = input.name
      if ((typeof name !== "string") || name.length < 2)
        alerts.push("invalid name");
      else
        user.SetName(name)
    }

    if (alerts.length > 0) {
      res.status(400).json({errors: alerts})
      return
    }

    this.userDao.Update(user)
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
    let user = req.user
    this.userDao.Delete(user.Id())
      .then(() => {
        res.status(204).send()
      })
      .catch(err => {
        switch(err) {
          default:
            res.status(500)
        }
        res.send()
      })
  }
  async GetDocs(req: Request, res: Response) {
    let user = req.user
    this.docDao.SelectAll({owner: user.Id()})
    .then(docs => {
      res.status(200).json(docs.map(doc => docViewModel(doc)))
    })
  }
  async PostDoc(req: Request, res: Response) {
    let { statusId, name } = req.body;
    let alerts: string[] = []

    let user = req.user

    if ((typeof name !== "string") || name.length < 2) {
      alerts.push("invalid name")
    }

    let status: DocStatus|null = null
    try {
      status = await this.docStatusDao.GetDocStatus(parseInt(statusId))
    } catch (err) {
      switch(err) {
        default:
          res.status(500)
      }
      res.send()
      return
    }

    if (status == null) {
      alerts.push("there's no such status")
    }
    
    if (alerts.length > 0) {
      res.status(400).json({errors: alerts})
      return
    }

    let doc = DocFactory.CreateDoc(name, user.Id(), (status as DocStatus).Id())
    this.docDao.Create(doc)
    .then(() => {
      res.status(201).json(docViewModel(doc))
    })
    .catch(err => {
      switch(err) {
        default:
          res.status(500)
      }
      res.send()
    })
  }
}
