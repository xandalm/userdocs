
interface UserFields {
  id: number
  name: string
  email: string
  createdAt: number
  updatedAt: number|null
  // deletedAt: number|null
}

export interface User {
  SetName(v: string) : void
  SetEmail(v: string) : void

  Id() : number
  Name() : string
  Email() : string
  CreatedAt() : Date
  UpdatedAt() : Date|null
  // DeletedAt() : Date|null
}

class UserImpl implements User {
  protected props: UserFields = {
    id: 0,
    name: "",
    email: "",
    createdAt: 0,
    updatedAt: null,
    // deletedAt: null,
  }
  constructor(props: {id?: number, email?: string, name?: string, createdAt?: number|null, updatedAt?: number|null, deletedAt?: number|null}){
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
  // SetDeletedAt(value: Date) {
  //   this.props.deletedAt = value.getTime();
  // }
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
  // DeletedAt(): Date|null {
  //   return this.props.deletedAt === null ? null : new Date(this.props.deletedAt);
  // }
}

class UserFactoryImpl {
  CreateUser(email: string, name: string) : User {
    return new UserImpl({email, name})
  }
}

export const UserFactory = new UserFactoryImpl

export interface UserStorage {
  CreateUser(email: string, name: string) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }>
  UpdateUser(id: number, email: string, name: string) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }>
  DeleteUser(id: number) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt: Date;
  }>
  GetUser(id: number) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }>
  GetActiveUsers(page: number, pageSize: number) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }[]>
}

export interface UserDAO {
  Create(user: User) : Promise<void>
  Update(user: User) : Promise<void>
  Delete(id: number) : Promise<void>
  Select(options?: {id?: number, email?: string, name?: string}) : Promise<User|null|User[]>
}

class UserDAOImpl implements UserDAO {
  private sto: UserStorage
  constructor(sto: UserStorage) {
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
    throw new Error("Method not implemented.")
  }
  Delete(id: number): Promise<void> {
    throw new Error("Method not implemented.")
  }
  Select(options?: { id?: number; email?: string; name?: string }): Promise<User | null | User[]> {
    throw new Error("Method not implemented.")
  }
}

var userDao : UserDAO|null = null

export function CreateUserDAO(storage: UserStorage) : UserDAO {
  if (userDao !== null) {
    throw new Error("user dao has already been setted")
  }
  return userDao = new UserDAOImpl(storage);
}
