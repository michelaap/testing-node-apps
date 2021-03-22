// Testing CRUD API Routes

import axios from 'axios'
import {resetDb, insertTestUser} from 'utils/db-utils'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as generate from 'utils/generate'
import * as booksDB from '../db/books'
import startServer from '../start'

let baseURL, server

beforeAll(async () => {
  server = await startServer()
  baseURL = `http://localhost:${server.address().port}/api`
})

afterAll(() => server.close())

beforeEach(() => resetDb())

async function setup() {
  const testUser = await insertTestUser()
  const authAPI = axios.create({baseURL})
  authAPI.defaults.headers.common.authorization = `Bearer ${testUser.token}`
  authAPI.interceptors.response.use(getData, handleRequestFailure)
  return {testUser, authAPI}
}

test('listItem CRUD', async () => {
  const {testUser, authAPI} = await setup()
  const book = generate.buildBook()
  await booksDB.insert(book)

  // CREATE
  const cData = await authAPI.post('list-items', {bookId: book.id})
  expect(cData.listItem).toMatchObject({
    ownerId: testUser.id,
    bookId: book.id,
  })

  const listItemId = cData.listItem.id
  const listItemIdUrl = `list-items/${listItemId}`

  // READ
  const rData = await authAPI.get(listItemIdUrl)
  expect(rData.listItem).toEqual(cData.listItem)

  // UPDATE
  const updates = {notes: generate.notes()}
  const uData = await authAPI.put(listItemIdUrl, updates)
  expect(uData.listItem).toEqual({...rData.listItem, ...updates})

  // DELETE
  // 🐨 make a DELETE request to the `listItemIdUrl`
  // 🐨 assert that this returns the right stuff (💰 {success: true})

  // 🐨 try to make a GET request to the `listItemIdUrl` again.
  // 💰 this promise should reject. You can do a try/catch if you want, or you
  // can use the `resolve` utility from utils/async:
  // 💰 const error = await authAPI.get(listItemIdUrl).catch(resolve)
  // 🐨 assert that the status is 404 and the error.data is correct
})

/* eslint no-unused-vars:0 */
