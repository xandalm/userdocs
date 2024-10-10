import { useState, useEffect } from "react"
import axios from "axios"

const api = axios.create({
  baseURL: "0.0.0.0:5000",
})
import React, { useState, useEffect } from 'react';

const users = [
  {id: "1", name: "john"},
  {id: "2", name: "anie"},
  {id: "3", name: "paul"},
]

const Users = (props) => {
  const [id, setId] = useState("")
  const [data, setData] = useState([])

  useEffect(() => {
    let url = (id !== "") ? "/users" : `/user/${id}`;
    api.get(url)
    .then(res => {
      if (res.status === 200) {
        setData(res.data)
      } else {
        setData([])
      }
    })
    .catch(() => {
      setData([])
    })
  }, [id])

  const handleInput = (e) => {
    let v = e.target.value
    setId(v)
  }

  return(
    <div>
      <h1>Users</h1>
      <form>
        <label htmlFor="userId">ID:</label>
        <input type="text" value={id} onChange={handleInput}/>
      </form>
      <br />
      {Array.isArray(data) ?
      <table>
        <thead>
          <tr><th>ID</th><th>NAME</th></tr>
        </thead>
        <tbody>
          {data && data.map((u, i) => {
            return (
              <tr key={i}><td>{u.id}</td><td>{u.name}</td></tr>
            )
          })}
        </tbody>
      </table>
      :
      <>
        <table>
          <thead>
            <tr><th colSpan={2}>USER DETAILS</th></tr>
          </thead>
          <tbody>
            <tr><th style={{textAlign: "left"}}>ID</th><td>{data.id}</td></tr>
            <tr><th style={{textAlign: "left"}}>EMAIL</th><td>{data.email}</td></tr>
            <tr><th style={{textAlign: "left"}}>NAME</th><td>{data.name}</td></tr>
            <tr><th style={{textAlign: "left"}}>CREATED</th><td>{data.createdAt}</td></tr>
            <tr><th style={{textAlign: "left"}}>UPDATED</th><td>{data.updatedAt??"-"}</td></tr>
          </tbody>
        </table>
        <Docs owner={id}/>
      </>
      }
    </div>
  )
}


const Docs = (props={owner}) => {
  const [id, setId] = useState("")
  const [data, setData] = useState([])

  useEffect(() => {
    if ((props.owner??"") !== "") {
      api.get(`/user/${props.owner}/docs`)
      .then(res => {
        if (res.status === 200) {
          setData(res.data)
        } else {
          setData([])
        }
      })
      .catch(() => {
        setData([])
      })
    }
  }, [props])

  useEffect(() => {
    let url = (id !== "") ? "/docs" : `/doc/${id}`;
    api.get(url)
    .then(res => {
      if (res.status === 200) {
        setData(res.data)
      } else {
        setData([])
      }
    })
    .catch(() => {
      setData([])
    })
  }, [id])

  const handleInput = (e) => {
    let v = e.target.value
    setId(v)
  }

  return(
    <div>
      <h1>Docs</h1>
      {props.owner !== undefined ?
      <table>
        <thead>
          <tr><th>ID</th><th>NAME</th><th>STATUS</th></tr>
        </thead>
        <tbody>
        {data && data.map((d, i) => {
          return (
            <tr key={i}><td>{d.id}</td><td>{d.name}</td><td>{d.status??d.statusId}</td></tr>
          )
        })}
        </tbody>
      </table>
      :
      <>
        <form>
          <label htmlFor="docId">ID:</label>
          <input type="text" value={id} onChange={handleInput}/>
        </form>
        <br />
        {Array.isArray(data) ?
        <table>
          <thead>
            <tr><th>ID</th><th>NAME</th><th>OWNER</th><th>STATUS</th></tr>
          </thead>
          <tbody>
            {data && data.map((d, i) => {
              return (
                <tr key={i}><td>{d.id}</td><td>{d.name}</td><td>{d.owner??d.ownerId}</td><td>{d.status??d.statusId}</td></tr>
              )
            })}
          </tbody>
        </table>
        :
        <table>
          <thead>
            <tr><th colSpan={2}>DOC DETAILS</th></tr>
          </thead>
          <tbody>
            <tr><th style={{textAlign: "left"}}>ID</th><td>{data.id}</td></tr>
            <tr><th style={{textAlign: "left"}}>NAME</th><td>{data.name}</td></tr>
            <tr><th style={{textAlign: "left"}}>OWNER</th><td>{data.owner??data.ownerId}</td></tr>
            <tr><th style={{textAlign: "left"}}>STATUS</th><td>{data.status??data.statusId}</td></tr>
            <tr><th style={{textAlign: "left"}}>CREATED</th><td>{data.createdAt}</td></tr>
            <tr><th style={{textAlign: "left"}}>UPDATED</th><td>{data.updatedAt??"-"}</td></tr>
          </tbody>
        </table>
        }
      </>
      }
    </div>
  )
}


export function App(props) {
  const [side, setSide] = useState("user")

  const handleButton = (e) => {
    setSide(curr => {
      if (curr === "user") {
        return "doc"
      }
      return "user"
    })
  }

  return (
    <div className='App'>
      <button onClick={handleButton}>{side}</button>
      {side === "user" && <Users />}
      {side === "doc" && <Docs />}
    </div>
  );
}
