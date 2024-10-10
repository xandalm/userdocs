# Tabela de Conteúdo

1. [Instruções para execução](#instructions)
2. [Esquemas](#scheme)
3. [Adicionar um usuário](#newuser)
4. [Atualizar usuário](#setuser)
5. [Excluir usuário](#deluser)
6. [Recuperar informações do usuário](#getuser)
7. [Adicionar documento a partir de um usuário](#newdocbyuser)
8. [Recuperar documentos de um usuário](#getdocsbyuser)
9. [Adicionar um documento](#newdoc)
10. [Atualizar documento](#setdoc)
11. [Excluir documento](#deldoc)
12. [Recuperar informações do documento](#getdoc)
13. [Recuperar informações dos usuários - inativo](#getusers)
14. [Recuperar informações dos documentos - inativo](#getdocs)

## <a name="instructions"></a><p style="font-size: 24px">Instruções para execução</p>

Necessário ambiente com NodeJS e npm instalados.

Mude o diretório de trabalho para a pasta do projeto.

Realize a construção (build) do projeto:

> npm run build

Em seguida, inicie a aplicação:

> npm run start

## <a name="scheme"></a><p style="font-size: 24px">Esquemas</p>

|User|Document|
|----|--------|
|id (*int64*) <br/> email (*string*) <br/> name (*string*) <br/> createdAt (*string* or *null*) <br/> updatedAt (*string* or *null*) |id (*int64*) <br/> name (*string*) <br/> ownerId (*int64*) <br/> statusId (*int64*) <br/> createdAt (*string* or *null*) <br/> updatedAt (*string* or *null*) |

*Obs: A API irá omitir valores não definidos em cada resposta de requisição. 

Por exemplo:

```
{
  id: 1,
  email: "john@email.com",
  name: "john", createdat: "2024-10-10T14:00:52.232Z",
  updatedAt: null
}
```

será retornado como:

```
{
  id: 1,  
  email: "john@email.com",  
  name: "john",  
  createdat: "2024-10-10T14:00:52.232Z"  
}
```

<!-- USER -->

<!-- <p style="font-size: 24px">Endpoints que passam por <b>/user</b></p> -->

## <a name="newuser"></a><p style="font-size: 18px"><b>POST</b>&nbsp;&nbsp;/user&nbsp;&nbsp;<i>Adicionar novo usuário</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
Nenhum.
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th>Corpo da requisição</th>
</tr>
</thead>
<tbody>
<tr>
<td>

**application/json**

Exemplo:

```
{
  "email": "jonh@email.com",
  "name": "john"
}
```

</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
201
</td>
<td>

**application/json**

Exemplo:

```
{
  "id": 1,
  "email": "jonh@email.com",
  "name": "john",
  "createdAt": "2024-10-10T14:00:52.232Z"
}
```

</td>
</tr>
<tr>
<td>
400
</td>
<td>
Entrada inválida
</td>
</tr>
</tbody>
</table>

## <a name="setuser"></a><p style="font-size: 18px"><b>PUT</b>&nbsp;&nbsp;/user/{userId}&nbsp;&nbsp;<i>Atualizar usuário existente</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
userId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th>Corpo da requisição</th>
</tr>
</thead>
<tbody>
<tr>
<td>

**application/json**

Exemplo:

```
{
  "email": "jonh@email.com",
  "name": "john"
}
```

</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
{
  "id": 1,
  "email": "jonh@email.com",
  "name": "john",
  "createdAt": "2024-10-10T14:00:52.232Z"
}
```

</td>
</tr>
<tr>
<td>
400
</td>
<td>
Entrada inválida
</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (usuário inexistente)
</td>
</tr>
</tbody>
</table>

## <a name="deluser"></a><p style="font-size: 18px"><b>DELETE</b>&nbsp;&nbsp;/user/{userId}&nbsp;&nbsp;<i>Excluir usuário existente</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
userId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>
<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
204
</td>
<td>
Usuário excluído
</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (usuário inexistente)
</td>
</tr>
</tbody>
</table>

## <a name="getuser"></a><p style="font-size: 18px"><b>GET</b>&nbsp;&nbsp;/user/{userId}&nbsp;&nbsp;<i>Recuperar usuário existente</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
userId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
{
  "id": 1,
  "email": "jonh@email.com",
  "name": "john",
  "createdAt": "2024-10-10T14:00:52.232Z",
  "updatedAt": null
}
```

</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (usuário inexistente)
</td>
</tr>
</tbody>
</table>

## <a name="newdocbyuser"></a><p style="font-size: 18px"><b>POST</b>&nbsp;&nbsp;/user/{userId}/doc&nbsp;&nbsp;<i>Adicionar novo documento ao usuário</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
userId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th>Corpo da requisição</th>
</tr>
</thead>
<tbody>
<tr>
<td>

**application/json**

Exemplo:

```
{
  "name": "resume",
  "statusId": 1
}
```

</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
{
  "id": 1,
  "name": "resume",
  "statusId": 1,
  "createdAt": "2024-10-10T14:00:52.232Z"
}
```

</td>
</tr>
<tr>
<td>
400
</td>
<td>
Entrada inválida
</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (usuário inexistente)
</td>
</tr>
</tbody>
</table>

## <a name="getdocsbyuser"></a><p style="font-size: 18px"><b>GET</b>&nbsp;&nbsp;/user/{userId}/docs&nbsp;&nbsp;<i>Recuperar documentos do usuário</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
userId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
[
  {
    "id": 1,
    "name": "resume",
    "statusId": 2,
    "createdAt": "2024-10-10T14:00:52.232Z",
    "updatedAt": "2024-10-10T14:09:25.126Z"
  },
  {
    "id": 2,
    "name": "paper",
    "statusId": 1,
    "createdAt": "2024-10-10T14:12:55.830Z",
    "updatedAt": null
  },
]
```

</td>
</tr>
<tr>
<td>
204
</td>
<td>
Busca concluída sem conteúdo relevante
</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (usuário inexistente)
</td>
</tr>
</tbody>
</table>

<!-- DOC -->

<!-- <p style="font-size: 24px">Endpoints que iniciam em <b>/doc</b></p> -->

## <a name="newdoc"></a><p style="font-size: 18px"><b>POST</b>&nbsp;&nbsp;/doc&nbsp;&nbsp;<i>Adicionar novo documento</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
Nenhum.
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th>Corpo da requisição</th>
</tr>
</thead>
<tbody>
<tr>
<td>

**application/json**

Exemplo:

```
{
  "name": "resume",
  "ownerId": 1,
  "statusId": 1,
}
```

</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
201
</td>
<td>

**application/json**

Exemplo:

```
{
  "id": 1,
  "name": "resume",
  "ownerId": 1,
  "statusId": 1,
  "createdAt": "2024-10-10T14:00:52.232Z"
}
```

</td>
</tr>
<tr>
<td>
400
</td>
<td>
Entrada inválida
</td>
</tr>
</tbody>
</table>

## <a name="setdoc"></a><p style="font-size: 18px"><b>PUT</b>&nbsp;&nbsp;/doc/{docId}&nbsp;&nbsp;<i>Atualizar documento existente</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
docId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th>Corpo da requisição</th>
</tr>
</thead>
<tbody>
<tr>
<td>

**application/json**

Exemplo:

```
{
  "name": "resume_v2",
  "statusId": 2,
}
```

</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
{
  "id": 1,
  "name": "resume_v2",
  "ownerId": 1,
  "statusId": 2,
  "createdAt": "2024-10-10T14:00:52.232Z"
}
```

</td>
</tr>
<tr>
<td>
400
</td>
<td>
Entrada inválida
</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (documento inexistente)
</td>
</tr>
</tbody>
</table>

## <a name="deldoc"></a><p style="font-size: 18px"><b>DELETE</b>&nbsp;&nbsp;/doc/{docId}&nbsp;&nbsp;<i>Excluir documento existente</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
docId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>
<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
204
</td>
<td>
Documento excluído
</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (documento inexistente)
</td>
</tr>
</tbody>
</table>

## <a name="getdoc"></a><p style="font-size: 18px"><b>GET</b>&nbsp;&nbsp;/doc/{docId}&nbsp;&nbsp;<i>Recuperar documento existente</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
docId: int64 <i>*requerido (in path)</i>
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
{
  "id": 3,
  "name": "notes",
  "ownerId": 1,
  "statusId": 1,
  "createdAt": "2024-10-10T14:00:52.232Z",
  "updatedAt": null
}
```

</td>
</tr>
<tr>
<td>
404
</td>
<td>
Recurso não encontrado (documento inexistente)
</td>
</tr>
</tbody>
</table>

## <a name="getusers"></a><p style="font-size: 18px"><b><i>INATIVO</i></b> - <b>GET</b>&nbsp;&nbsp;/user&nbsp;&nbsp;<i>Recuperar usuários existentes</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
Nenhum.
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
[
  {
    "id": 1,
    "email": "jonh@email.com",
    "name": "john",
    "createdAt": "2024-10-10T14:00:52.232Z",
    "updatedAt": "2024-10-10T14:09:25.126Z"
  },
  {
    "id": 2,
    "email": "anie@email.com",
    "name": "anie",
    "createdAt": "2024-10-10T14:12:55.830Z",
    "updatedAt": null
  },
]
```

</td>
</tr>
<tr>
<td>
204
</td>
<td>
Busca concluída sem conteúdo relevante
</td>
</tr>
</tbody>
</table>

## <a name="getdocs"></a><p style="font-size: 18px"><b><i>INATIVO</i></b> - <b>GET</b>&nbsp;&nbsp;/doc&nbsp;&nbsp;<i>Recuperar documentos existentes</i></p>

<table style="width: 100%">
<thead>
<tr>
<th>Parâmetros</th>
</tr>
</thead>
<tbody>
<tr>
<td>
Nenhum.
</td>
</tr>
</tbody>
</table>

<table style="width: 100%">
<thead>
<tr>
<th colspan="2">Resposta</th>
</tr>
</thead>
<tbody>
<tr>
<td>
200
</td>
<td>

**application/json**

Exemplo:

```
[
  {
    "id": 1,
    "name": "resume",
    "ownerId": 1,
    "statusId": 1,
    "createdAt": "2024-10-10T14:00:52.232Z",
    "updatedAt": "2024-10-10T14:05:18.122Z"
  },
  {
    "id": 2,
    "name": "paper",
    "ownerId": 1,
    "statusId": 1,
    "createdAt": "2024-10-10T14:00:52.232Z",
    "updatedAt": null
  },
]
```

</td>
</tr>
<tr>
<td>
204
</td>
<td>
Busca concluída sem conteúdo relevante
</td>
</tr>
</tbody>
</table>
