import { Storage, UserUpdateResult } from "../persistence/storage"

interface UserFields {
  id: number
  name: string
  email: string
  createdAt: number
  updatedAt: number|null
}

export interface User {
  SetName(v: string) : void
  SetEmail(v: string) : void

  Id() : number
  Name() : string
  Email() : string
  CreatedAt() : Date
  UpdatedAt() : Date|null
}

class UserImpl implements User {
  protected props: UserFields = {
    id: 0,
    name: "",
    email: "",
    createdAt: 0,
    updatedAt: null,
  }
  constructor(props: {id?: number, email?: string, name?: string, createdAt?: number|null, updatedAt?: number|null}){
    Object.assign(this.props, props)
  }
  SetId(value: number) {
    this.props.id = value;
  }
  SetName(value: string) {
    this.props.name = value;
  }
  SetEmail(value: string) {
    this.props.email = value;
  }
  SetCreatedAt(value: Date) {
    this.props.createdAt = value.getTime();
  }
  SetUpdatedAt(value: Date) {
    this.props.updatedAt = value.getTime();
  }
  
  Name(): string {
    return this.props.name;
  }
  Email(): string {
    return this.props.email;
  }
  Id(): number {
    return this.props.id;
  }
  CreatedAt(): Date {
    return new Date(this.props.createdAt);
  }
  UpdatedAt(): Date|null {
    return this.props.updatedAt === null ? null : new Date(this.props.updatedAt);
  }
}

class UserFactoryImpl {
  CreateUser(email: string, name: string) : User {
    return new UserImpl({email, name})
  }
}

export const UserFactory = new UserFactoryImpl

export const ErrEmailAlreadyExists = new Error("email already exists")
export const ErrInexistentUser = new Error("there is no such user")
export const ErrUnableToCreateUser = new Error("unable to create user due to storage error")
export const ErrUnableToUpdateUser = new Error("unable to update user due to storage error")
export const ErrUnableToDeleteUser = new Error("unable to delete user due to storage error")
export const ErrUnableToSelectUser = new Error("unable to delete user due to storage error")

export interface UserDAO {
  Create(user: User) : Promise<void>
  Update(user: User) : Promise<void>
  Delete(id: number) : Promise<void>
  Select(id: number) : Promise<User|null>
  SelectAll(options?: {
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
  }) : Promise<User[]>
}

class UserDAOImpl implements UserDAO {
  private sto: Storage
  constructor(sto: Storage) {
    this.sto = sto
  }
  async Create(user: User) : Promise<void> {
    if (!(user instanceof UserImpl)) {
      throw new Error("incompatible type")
    }
    return new Promise((resolve, reject) => {
      this.sto.CreateUser(user.Email(), user.Name())
      .then(res => {
        user.SetId(res.id)
        user.SetCreatedAt(res.createdAt)
        resolve()
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  Update(user: User): Promise<void> {
    if (!(user instanceof UserImpl)) {
      throw new Error("incompatible type")
    }
    return new Promise((resolve, reject) => {
      this.sto.UpdateUser(user.Id(), {email: user.Email(), name: user.Name()})
      .then(res => {
        if (res.hasOwnProperty("updatedAt")) {
          let data = res as UserUpdateResult
          user.SetEmail(data.email)
          user.SetName(data.name)
          user.SetUpdatedAt(data.updatedAt)
        }
        resolve()
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  Delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sto.DeleteUser(id)
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  Select(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.sto.SelectUser(id)
      .then(res => {
        let user = (res === null)?
          null
          :
          new UserImpl({
            ...res,
            createdAt: res.createdAt.getTime(),
            updatedAt: res.updatedAt?.getTime()||null
          })
        resolve(user)
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  SelectAll(options?: {
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
  }): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.sto.SelectUsers()
      .then(res => {
        let users: User[] = res.map(usr => new UserImpl({
          id: usr.id,
          email: usr.email,
          name: usr.name,
          createdAt: usr.createdAt.getTime(),
          updatedAt: usr.updatedAt == null ? null : usr.updatedAt.getTime()
        }))
        resolve(users)
      })
      .catch(err => {
        reject(err)
      })
    })
  }
}

var userDao : UserDAO|null = null

export function CreateUserDAO(storage: Storage) : UserDAO {
  if (userDao !== null) {
    throw new Error("user dao has already been setted")
  }
  return userDao = new UserDAOImpl(storage);
}
