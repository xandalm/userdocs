import { DocCreateResult, DocSelectResult, DocStatusSelectResult, DocUpdateResult, ErrViolatesStatusReference, ErrViolatesUniqueEmail, ErrViolatesUserReference, Storage, UserCreateResult, UserSelectResult, UserUpdateResult } from "./storage";

interface UserData {
  id: number,
  email: string,
  name: string,
  createdAt: Date,
  updatedAt: Date|null,
}

interface DocumentData {
  id: number,
  name: string,
  owner: number,
  status: number,
  createdAt: Date,
  updatedAt: Date|null,
}

interface DocumentStatusData {
  id: number,
  name: string
}

export default class MemoryStorage implements Storage {
  usersPk: number = 1
  docsPk: number = 1
  users = new Map<number, UserData>
  usersByEmail = new Map<string, UserData>
  docs = new Map<number, DocumentData>
  docstatus = new Map<number, DocumentStatusData>
  
  constructor() {
    this.docstatus.set(1, {id: 1, name: "Status One"})
    this.docstatus.set(2, {id: 2, name: "Status Two"})
  }

  CreateUser(email: string, name: string): Promise<UserCreateResult> {let holdingEmail = this.usersByEmail.get(email)
    if (holdingEmail != null) {
      throw ErrViolatesUniqueEmail
    }
    let user: UserData = {
      id: this.usersPk++,
      email: email,
      name: name,
      createdAt: new Date,
      updatedAt: null
    }
    this.users.set(user.id, user);
    this.usersByEmail.set(user.email, user);
    return Promise.resolve({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    })
  }
  UpdateUser(id: number, set: { email?: string; name?: string; }): Promise<UserUpdateResult|{}> {
    
    let user = this.users.get(id);
    if (user == null) {
      return Promise.resolve({})
    }
    let mutated = false;
    if (set.hasOwnProperty("email")) {
      let email = set.email as string;
      let holdingEmail = this.usersByEmail.get(email);
      if (holdingEmail != null && holdingEmail.id != id) {
        throw ErrViolatesUniqueEmail
      }
      this.usersByEmail.delete(user.email);
      user.email = email;
      this.usersByEmail.set(email, user);
      mutated = true
    }
    if (set.hasOwnProperty("name")) {
      user.name = set.name as string
      mutated = true
    }
    if (mutated) {
      user.updatedAt = new Date
    }
    return Promise.resolve(user)
  }
  DeleteUser(id: number): Promise<void> {
    let user = this.users.get(id);
    if (user == null) {
      return Promise.resolve()
    }
    this.usersByEmail.delete(user.email)
    this.users.delete(user.id)
    return Promise.resolve()
  }
  SelectUser(id: number): Promise<UserSelectResult|null> {
    let user = this.users.get(id)
    if (user == null) {
      return Promise.resolve(null)
    }
    return Promise.resolve(user)
  }
  SelectUsers(options: {
    email?: {
      prefix?: string,
      infix?: string,
      suffix?: string
    }, 
    name?: {
      prefix?: string,
      infix?: string,
      suffix?: string
    }
  } = {}): Promise<UserSelectResult[]> {
    let users: UserData[] = []

    type Fn = (u: UserData) => boolean

    const emailChecks: Fn[] = []
    if (options.hasOwnProperty("email")) {
      let emailOpt = options.email as {prefix?: string, infix?: string, suffix?: string}
      if (emailOpt.hasOwnProperty("prefix")) {
        let prefix: string = emailOpt.prefix as string
        emailChecks.push((u: UserData) => u.email.startsWith(prefix))
      }
      if (emailOpt.hasOwnProperty("infix")) {
        let infix: string = emailOpt.infix as string
        emailChecks.push((u: UserData) => u.email.includes(infix))
      }
      if (emailOpt.hasOwnProperty("suffix")) {
        let suffix: string = emailOpt.suffix as string
        emailChecks.push((u: UserData) => u.email.endsWith(suffix))
      }
    }

    const nameChecks: Fn[] = []
    if (options.hasOwnProperty("name")) {
      let nameOpt = options.name as {prefix?: string, infix?: string, suffix?: string}
      if (nameOpt.hasOwnProperty("prefix")) {
        let prefix: string = nameOpt.prefix as string
        nameChecks.push((u: UserData) => u.name.startsWith(prefix))
      }
      if (nameOpt.hasOwnProperty("infix")) {
        let infix: string = nameOpt.infix as string
        nameChecks.push((u: UserData) => u.name.includes(infix))
      }
      if (nameOpt.hasOwnProperty("suffix")) {
        let suffix: string = nameOpt.suffix as string
        nameChecks.push((u: UserData) => u.name.endsWith(suffix))
      }
    }

    const pass = (u: UserData, tests: Fn[]) => {
      for (let i = 0; i < tests.length; i++) {
        const fn = tests[i];
        if (!fn(u)) {
          return false
        }
      }
      return true
    }

    this.users.forEach(user => {
      if (pass(user, emailChecks) && pass(user, nameChecks)) {
        users.push(user)
      }
    })

    return Promise.resolve(users)
  }
  CreateDoc(name: string, owner: number, status: number): Promise<DocCreateResult> {
    if (!this.users.has(owner)) {
      throw ErrViolatesUserReference
    }
    if (!this.docstatus.has(status)) {
      throw ErrViolatesStatusReference
    }
    let data: DocumentData = {
      id: this.docsPk++,
      name: name,
      owner: owner,
      status: status,
      createdAt: new Date,
      updatedAt: null
    }
    this.docs.set(data.id, data)
    return Promise.resolve(data)
  }
  UpdateDoc(id: number, set: { name?: string; status?: number; }): Promise<DocUpdateResult|{}> {
    let doc = this.docs.get(id);
    if (doc == null) {
      return Promise.resolve({})
    }
    let mutated = false
    if (set.hasOwnProperty("name")) {
      doc.name = set.name as string;
      mutated = true
    }
    if (set.hasOwnProperty("status")) {
      let status = set.status as number;
      if (!this.docstatus.has(status)) {
        throw ErrViolatesStatusReference
      }
      doc.status = status;
      mutated = true
    }
    if (mutated) {
      doc.updatedAt = new Date;
    }
    return Promise.resolve(doc)
  }
  DeleteDoc(id: number): Promise<void> {
    let doc = this.docs.get(id);
    if (doc == null) {
      return Promise.resolve()
    }
    this.docs.delete(doc.id)
    return Promise.resolve()
  }
  SelectDoc(id: number): Promise<DocSelectResult | null> {
    let doc = this.docs.get(id)
    if (doc == null) {
      return Promise.resolve(null)
    }
    return Promise.resolve(doc)
  }
  SelectDocs(options: {
    name?: {
      prefix?: string;
      infix?: string;
      suffix?: string;
    };
    owner?: number;
    status?: number;
  }={}): Promise<DocSelectResult[]> {
    let docs: DocumentData[] = []

    type Fn = (d: DocumentData) => boolean

    const nameChecks: Fn[] = []
    if (options.hasOwnProperty("name")) {
      let nameOpt = options.name as {prefix?: string, infix?: string, suffix?: string}
      if (nameOpt.hasOwnProperty("prefix")) {
        let prefix: string = nameOpt.prefix as string
        nameChecks.push((d: DocumentData) => d.name.startsWith(prefix))
      }
      if (nameOpt.hasOwnProperty("infix")) {
        let infix: string = nameOpt.infix as string
        nameChecks.push((d: DocumentData) => d.name.includes(infix))
      }
      if (nameOpt.hasOwnProperty("suffix")) {
        let suffix: string = nameOpt.suffix as string
        nameChecks.push((d: DocumentData) => d.name.endsWith(suffix))
      }
    }

    const ownerChecks: Fn[] = []
    if (options.hasOwnProperty("owner")) {
      let owner: number = options.owner as number
      ownerChecks.push((d: DocumentData) => d.owner === owner)
    }

    const statusChecks: Fn[] = []
    if (options.hasOwnProperty("status")) {
      let status: number = options.status as number
      statusChecks.push((d: DocumentData) => d.status === status)
    }

    const pass = (u: DocumentData, tests: Fn[]) => {
      for (let i = 0; i < tests.length; i++) {
        const fn = tests[i];
        if (!fn(u)) {
          return false
        }
      }
      return true
    }

    this.docs.forEach(doc => {
      if (pass(doc, nameChecks) && pass(doc, ownerChecks) && pass(doc, statusChecks)) {
        docs.push(doc)
      }
    })

    return Promise.resolve(docs)
  }
  SelectDocStatus(id: number): Promise<DocStatusSelectResult|null> {
    let status = this.docstatus.get(id)
    if (status == null) {
      return Promise.resolve(null)
    }
    return Promise.resolve(status)
  }
}
