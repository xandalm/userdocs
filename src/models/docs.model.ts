import { DocUpdateResult, Storage } from "../persistence/storage"

interface DocFields {
  id: number
  name: string
  owner: number
  status: number
  createdAt: number
  updatedAt: number|null
}

export interface Doc {
  SetName(v: string) : void
  SetStatus(v: number) : void

  Id() : number
  Name() : string
  Owner() : number
  Status() : number
  CreatedAt() : Date
  UpdatedAt() : Date|null
}

class DocImpl implements Doc {
  protected props: DocFields = {
    id: 0,
    name: "",
    owner: 0,
    status: 0,
    createdAt: 0,
    updatedAt: null,
  }
  constructor(props: {id?: number, name?: string, owner?: number, status?: number, createdAt?: number|null, updatedAt?: number|null}){
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
  
  Id(): number {
    return this.props.id;
  }
  Name(): string {
    return this.props.name;
  }
  Owner(): number {
    return this.props.status;
  }
  Status(): number {
    return this.props.status;
  }
  CreatedAt(): Date {
    return new Date(this.props.createdAt);
  }
  UpdatedAt(): Date|null {
    return this.props.updatedAt === null ? null : new Date(this.props.updatedAt);
  }
}

class DocFactoryImpl {
  CreateDoc(name: string, owner: number, status: number) : Doc {
    return new DocImpl({name, owner, status})
  }
}

export const DocFactory = new DocFactoryImpl

export const ErrEmailAlreadyExists = new Error("email already exists")
export const ErrInexistentDoc = new Error("there is no such doc")
export const ErrUnableToCreateDoc = new Error("unable to create doc due to storage error")
export const ErrUnableToUpdateDoc = new Error("unable to update doc due to storage error")
export const ErrUnableToDeleteDoc = new Error("unable to delete doc due to storage error")
export const ErrUnableToSelectDoc = new Error("unable to delete doc due to storage error")

export interface DocDAO {
  Create(doc: Doc) : Promise<void>
  Update(doc: Doc) : Promise<void>
  Delete(id: number) : Promise<void>
  Select(id: number) : Promise<Doc|null>
  SelectAll(options?: {
    name?: {
      prefix?: string,
      infix?: string,
      suffix?: string
    }
    status?: number
  }) : Promise<Doc[]>
}

class DocDAOImpl implements DocDAO {
  private sto: Storage
  constructor(sto: Storage) {
    this.sto = sto
  }
  async Create(doc: Doc) : Promise<void> {
    if (!(doc instanceof DocImpl)) {
      throw new Error("incompatible type")
    }
    return new Promise((resolve, reject) => {
      this.sto.CreateDoc(doc.Name(), doc.Owner(), doc.Status())
      .then(res => {
        doc.SetId(res.id)
        doc.SetCreatedAt(res.createdAt)
        resolve()
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  Update(doc: Doc): Promise<void> {
    if (!(doc instanceof DocImpl)) {
      throw new Error("incompatible type")
    }
    return new Promise((resolve, reject) => {
      this.sto.UpdateDoc(doc.Id(), {name: doc.Name(), status: doc.Status()})
      .then(res => {
        if (res.hasOwnProperty("updatedAt")) {
          let data = res as DocUpdateResult
          doc.SetName(data.name)
          doc.SetStatus(data.status)
          doc.SetUpdatedAt(data.updatedAt)
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
      this.sto.DeleteDoc(id)
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  Select(id: number): Promise<Doc | null> {
    return new Promise((resolve, reject) => {
      this.sto.SelectDoc(id)
      .then(res => {
        let doc = (res === null)?
          null
          :
          new DocImpl({
            ...res,
            createdAt: res.createdAt.getTime(),
            updatedAt: res.updatedAt?.getTime()||null
          })
        resolve(doc)
      })
      .catch(err => {
        reject(err)
      })
    })
  }
  SelectAll(options?: { 
    name?: {
      prefix?: string,
      infix?: string,
      suffix?: string
    },
    status?: number
  }): Promise<Doc[]> {
    return new Promise((resolve, reject) => {
      this.sto.SelectDocs()
      .then(res => {
        let docs: Doc[] = res.map(doc => new DocImpl({
          id: doc.id,
          name: doc.name,
          owner: doc.owner,
          status: doc.status,
          createdAt: doc.createdAt.getTime(),
          updatedAt: doc.updatedAt == null ? null : doc.updatedAt.getTime()
        }))
        resolve(docs)
      })
      .catch(err => {
        reject(err)
      })
    })
  }
}

var docDao : DocDAO|null = null

export function CreateDocDAO(storage: Storage) : DocDAO {
  if (docDao !== null) {
    throw new Error("doc dao has already been setted")
  }
  return docDao = new DocDAOImpl(storage);
}
