
interface UserFields {
  id: number|null
  name: string|null
  email: string|null
  createdAt: number|null
  updatedAt: number|null
  deletedAt: number|null
}

export interface User {
  SetName(v: string) : void
  SetEmail(v: string) : void

  Id() : number|null
  Name() : string|null
  Email() : string|null
  CreatedAt() : Date|null
  UpdatedAt() : Date|null
  DeletedAt() : Date|null
}

class UserImpl implements User {
  protected props: UserFields = {
    id: null,
    name: null,
    email: null,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
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
  SetDeletedAt(value: Date) {
    this.props.deletedAt = value.getTime();
  }
  Name(): string|null {
    return this.props.name;
  }
  Email(): string|null {
    return this.props.email;
  }
  Id(): number|null {
    return this.props.id;
  }
  CreatedAt(): Date|null {
    return this.props.createdAt === null ? null : new Date(this.props.createdAt);
  }
  UpdatedAt(): Date|null {
    return this.props.updatedAt === null ? null : new Date(this.props.updatedAt);
  }
  DeletedAt(): Date|null {
    return this.props.deletedAt === null ? null : new Date(this.props.deletedAt);
  }
}

class UserFactoryImpl {
  CreateUser(email: string, name: string) : User {
    return new UserImpl({email, name})
  }
}

export const UserFactory = new UserFactoryImpl
