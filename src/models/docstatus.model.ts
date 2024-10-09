import { Storage } from "../persistence/storage"

interface DocStatusFields {
  id: number
  name: string
}

export interface DocStatus {
  Id() : number
  Name() : string
}

class DocStatusImpl implements DocStatus {
  private props: DocStatusFields = {
    id: 0,
    name: ""
  }
  constructor(props: {id?: number, name?: string}) {
    Object.assign(this.props, props)
  }
  Id(): number {
    return this.props.id
  }
  Name(): string {
    return this.props.name
  }
}

export interface DocStatusDAO {
  GetDocStatus(id: number) : Promise<DocStatus|null>
}

export class DocStatusDAOImpl implements DocStatusDAO {
  private sto: Storage
  constructor(sto: Storage) {
    this.sto = sto
  }
  async GetDocStatus(id: number): Promise<DocStatus|null> {
    return new Promise((resolve, reject) => {
      this.sto.SelectDocStatus(id)
      .then(res => {
        let status = (res == null) ?
          null
          :
          new DocStatusImpl(res)
        resolve(status)
      })
      .catch(err => {
        reject(new Error("unable to select document status"))
      })
    })
  }
}

var docStatusDao : DocStatusDAO|null = null

export function CreateDocStatusDAO(storage: Storage) : DocStatusDAO {
  if (docStatusDao !== null) {
    throw new Error("doc status dao has already been setted")
  }
  return docStatusDao = new DocStatusDAOImpl(storage);
}
