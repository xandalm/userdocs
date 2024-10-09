

export const ErrViolatesUniqueEmail = new Error("email already exists")
export const ErrViolatesUserReference = new Error("inexistent user")
export const ErrViolatesStatusReference = new Error("inexistent status")

export interface Storage {
  CreateUser(email: string, name: string) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date|null;
  }>
  UpdateUser(id: number, set: {email?: string, name?: string}) : Promise<{
    id?: number;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt: Date;
  }|{}>
  DeleteUser(id: number) : Promise<void>
  SelectUser(id: number) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date|null;
  }|null>
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
  }) : Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date|null;
  }[]>
  CreateDoc(name: string, owner: number, status: number) : Promise<{
    id: number;
    name: string;
    owner: number;
    status: number;
    createdAt: Date;
    updatedAt?: Date|null;
  }>
  UpdateDoc(id: number, set: {name?: string, status?: number}) : Promise<{
    id?: number;
    name: string;
    owner: number;
    status: number;
    createdAt?: Date;
    updatedAt: Date;
  }|{}>
  DeleteDoc(id: number) : Promise<void>
  SelectDoc(id: number) : Promise<{
    id: number;
    name: string;
    owner: number;
    status: number;
    createdAt: Date;
    updatedAt?: Date|null;
  }|null>
  SelectDocs(options?: {
    name?: {
      prefix?: string,
      infix?: string,
      suffix?: string
    },
    owner?: number,
    status?: number,
  }) : Promise<{
    id: number;
    name: string;
    owner: number;
    status: number;
    createdAt: Date;
    updatedAt?: Date|null;
  }[]>
}