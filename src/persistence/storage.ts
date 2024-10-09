

export const ErrViolatesUniqueEmail = new Error("email already exists")
export const ErrViolatesUserReference = new Error("inexistent user")
export const ErrViolatesStatusReference = new Error("inexistent status")

export interface UserCreateResult {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date|null;
}

export interface UserUpdateResult {
  id?: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt: Date;
}

export interface UserSelectResult {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date|null;
}

export interface DocCreateResult {
  id: number;
  name: string;
  owner: number;
  status: number;
  createdAt: Date;
  updatedAt?: Date|null;
}

export interface DocUpdateResult {
  id?: number;
  name: string;
  owner?: number;
  status: number;
  createdAt?: Date;
  updatedAt: Date;
}

export interface DocSelectResult {
  id: number;
  name: string;
  owner: number;
  status: number;
  createdAt: Date;
  updatedAt?: Date|null;
}

export interface Storage {
  CreateUser(email: string, name: string) : Promise<UserCreateResult>
  UpdateUser(id: number, set: {email?: string, name?: string}) : Promise<UserUpdateResult|{}>
  DeleteUser(id: number) : Promise<void>
  SelectUser(id: number) : Promise<UserSelectResult|null>
  SelectUsers(options?: {
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
  }) : Promise<UserSelectResult[]>
  CreateDoc(name: string, owner: number, status: number) : Promise<DocCreateResult>
  UpdateDoc(id: number, set: {name?: string, status?: number}) : Promise<DocUpdateResult|{}>
  DeleteDoc(id: number) : Promise<void>
  SelectDoc(id: number) : Promise<DocSelectResult|null>
  SelectDocs(options?: {
    name?: {
      prefix?: string,
      infix?: string,
      suffix?: string
    },
    owner?: number,
    status?: number,
  }) : Promise<DocSelectResult[]>
}