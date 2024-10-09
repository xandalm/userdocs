
interface DocFields {
  id: number|null
  name: string|null
  owner: number|null
  status: number|null
  createdAt: number|null
  updatedAt: number|null
  deletedAt: number|null
}

export interface Doc {
  SetName(v: string) : void
  SetStatus(v: number) : void

  Id() : number|null
  Name() : string|null
  Status() : number|null
  CreatedAt() : Date|null
  UpdatedAt() : Date|null
  DeletedAt() : Date|null
}

class DocImpl implements Doc {
  protected props: DocFields = {
    id: null,
    name: null,
    owner: null,
    status: null,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  }
  constructor(props: {id?: number, name?: string, owner?: number, status?: number, createdAt?: number|null, updatedAt?: number|null, deletedAt?: number|null}){
    Object.assign(this.props, props)
  }
  SetId(value: number) {
    this.props.id = value;
  }
  SetName(value: string) {
    this.props.name = value;
  }
  SetOwner(value: number) {
    this.props.owner = value;
  }
  SetStatus(value: number) {
    this.props.status = value;
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
  
  Id(): number|null {
    return this.props.id;
  }
  Name(): string|null {
    return this.props.name;
  }
  Owner(): number|null {
    return this.props.status;
  }
  Status(): number|null {
    return this.props.status;
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

class DocFactoryImpl {
  CreateDoc(name: string, owner: number, status: number) : Doc {
    return new DocImpl({name, owner, status})
  }
}

export const DocFactory = new DocFactoryImpl
