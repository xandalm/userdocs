import { ErrEmailAlreadyExists, ErrInexistentUser, UserStorage } from "../models/user.model";

interface UserData {
  id: number,
  email: string,
  name: string,
  createdAt: Date,
  updatedAt: Date|null,
}

export default class MemoryStorage implements UserStorage {
  usersPk: number = 1
  users = new Map<number, UserData>
  usersByEmail = new Map<string, UserData>
  CreateUser(email: string, name: string): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt?: Date | null; }> {let holdingEmail = this.usersByEmail.get(email)
    if (holdingEmail != null) {
      throw ErrEmailAlreadyExists
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
  UpdateUser(id: number, set: { email?: string; name?: string; }): Promise<{ id?: number; name: string; email: string; createdAt?: Date; updatedAt: Date; }> {
    
    let user = this.users.get(id)
    if (user == null) {
      throw ErrInexistentUser
    }
    
    if (set.hasOwnProperty("email")) {
      let email = set.email as string;
      let holdingEmail = this.usersByEmail.get(email);
      if (holdingEmail != null && holdingEmail.id != id) {
        throw ErrEmailAlreadyExists
      }
      this.usersByEmail.delete(user.email);
      user.email = email;
      this.usersByEmail.set(email, user)
    }
    if (set.hasOwnProperty("name")) {
      user.name = set.name as string
    }
    user.updatedAt = new Date;
    return Promise.resolve({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
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
  SelectUser(id: number): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt?: Date | null; }|null> {
    let user = this.users.get(id)
    if (user == null) {
      return Promise.resolve(null)
    }
    return Promise.resolve(user)
  }
  SelectUsers(options: {
    email?: {
      prefix?: string,
      contains?: string,
      suffix?: string
    }, 
    name?: {
      prefix?: string,
      contains?: string,
      suffix?: string
    }
  } = {}): Promise<{ id: number; name: string; email: string; createdAt: Date; updatedAt?: Date | null; }[]> {
    let users = new Array<UserData>

    const emailChecks: ((u: UserData) => boolean)[] = []
    if (options.hasOwnProperty("email")) {
      let emailOpt = options.email as {prefix?: string, contains?: string, suffix?: string}
      if (emailOpt.hasOwnProperty("prefix")) {
        let prefix: string = emailOpt.prefix as string
        emailChecks.push((u: UserData) => u.email.startsWith(prefix))
      }
      if (emailOpt.hasOwnProperty("contains")) {
        let contains: string = emailOpt.contains as string
        emailChecks.push((u: UserData) => u.email.includes(contains))
      }
      if (emailOpt.hasOwnProperty("suffix")) {
        let suffix: string = emailOpt.suffix as string
        emailChecks.push((u: UserData) => u.email.endsWith(suffix))
      }
    }

    const nameChecks: ((u: UserData) => boolean)[] = []
    if (options.hasOwnProperty("name")) {
      let nameOpt = options.name as {prefix?: string, contains?: string, suffix?: string}
      if (nameOpt.hasOwnProperty("prefix")) {
        let prefix: string = nameOpt.prefix as string
        nameChecks.push((u: UserData) => u.name.startsWith(prefix))
      }
      if (nameOpt.hasOwnProperty("contains")) {
        let contains: string = nameOpt.contains as string
        nameChecks.push((u: UserData) => u.name.includes(contains))
      }
      if (nameOpt.hasOwnProperty("suffix")) {
        let suffix: string = nameOpt.suffix as string
        nameChecks.push((u: UserData) => u.name.endsWith(suffix))
      }
    }

    const pass = (u: UserData, tests: ((u: UserData) => boolean)[]) => {
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
}
