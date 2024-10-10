import { NextFunction, Request, Response } from "express"
import { User, UserDAO, UserFactory } from "../models/user.model"
import { Doc, DocDAO, DocFactory } from "../models/docs.model"
import { DocStatus, DocStatusDAO } from "../models/docstatus.model"

interface OwnerViewModel {
  id: number
  email: string
  name: string
}

interface StatusViewModel {
  id: number
  name?: string
}

interface DocViewModel {
  id: number
  name: string
  ownerId?: number
  owner?: OwnerViewModel
  statusId?: number
  status?: StatusViewModel
  createdAt: string
  updatedAt?: string
}

function docViewModel(doc: Doc, u?: User|null, s?: DocStatus|null) : DocViewModel {
  let data: DocViewModel = {
    id: doc.Id(),
    name: doc.Name(),
    createdAt: doc.CreatedAt().toISOString(),
  }

  if (u == null) {
    data.ownerId = doc.Owner()
  } else {
    data.owner = {
      id: u.Id(),
      email: u.Email(),
      name: u.Name()
    }
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
export default class DocController {
  private userDao: UserDAO
  private docDao: DocDAO
  private docStatusDao: DocStatusDAO
  constructor(userDao: UserDAO, docDao: DocDAO, docStatusDao: DocStatusDAO) {
    this.userDao = userDao;
    this.docDao = docDao;
    this.docStatusDao = docStatusDao
  }
  async FindDoc(req: Request, res: Response, next: NextFunction, id: any) {
    this.docDao.Select(parseInt(id))
    .then(doc => {
      if (doc === null) {
        res.status(404).send()
        return
      }
      req.doc = doc;
      next()
    })
    .catch(err => {
      switch(err) {
        default:
          res.status(500)
      }
      res.send()
    })
  }
  async Post(req: Request, res: Response) {
    let { ownerId, statusId, name } = req.body;
    let alerts: string[] = []

    if ((typeof name !== "string") || name.length < 2) {
      alerts.push("invalid name")
    }
    
    let owner: User|null = null
    let status: DocStatus|null = null
    try {
      owner = await this.userDao.Select(parseInt(ownerId))
      status = await this.docStatusDao.GetDocStatus(parseInt(statusId))
    } catch (err) {
      switch(err) {
        default:
          res.status(500)
      }
      res.send()
      return
    }

    if (owner == null) {
      alerts.push("there's no such user")
    }
    
    if (status == null) {
      alerts.push("there's no such status")
    }
    
    if (alerts.length > 0) {
      res.status(400).json({errors: alerts})
      return
    }

    let doc = DocFactory.CreateDoc(
      name,
      (owner as User).Id(),
      (status as DocStatus).Id()
    )

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
  async Get(req: Request, res: Response) {
    let doc = req.doc
    res.status(200).json(docViewModel(doc))
  }
  async GetMany(req: Request, res: Response) {
    this.docDao.SelectAll()
      .then(docs => {
        if (docs.length === 0) {
          res.status(204).send();
          return
        }
        res.status(200).json(docs.map(doc => docViewModel(doc)))
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
    let alerts: string[] = []

    let doc = req.doc;
    if (input.hasOwnProperty("name")) {
      const name = input.name
      if ((typeof name !== "string") || name.length < 2)
        alerts.push("invalid name");
      else
        doc.SetName(name)
    }
    if (input.hasOwnProperty("statusId")) {
      let status: DocStatus|null
      try {
        status = await this.docStatusDao.GetDocStatus(input.statusId)
      } catch (err) {
        switch(err) {
          default:
            res.status(500)
        }
        res.send()
        return
      }
      if (status == null)
        alerts.push("there's no such status")
      else
        doc.SetStatus((status as DocStatus).Id())
    }

    if (alerts.length > 0) {
      res.status(400).json({errors: alerts})
      return
    }

    this.docDao.Update(doc)
      .then(() => {
        res.status(200).json(docViewModel(doc))
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
    let doc = req.doc;
    this.docDao.Delete(doc.Id())
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
}
