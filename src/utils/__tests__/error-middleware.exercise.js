// Testing Middleware

import {UnauthorizedError} from 'express-jwt'
import {buildReq, buildRes, buildNext} from 'utils/generate'
import errorMiddleware from '../error-middleware'

test('responds with 401 for express-jwt UnauthorizedError', () => {
  const code = 'some_error_code'
  const message = 'Some message'
  const error = new UnauthorizedError(code, {message})
  const req = buildReq()
  const res = buildRes()
  const next = buildNext()

  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(401)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    code: error.code,
    message: error.message,
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('calls next if headersSent is true', () => {
  const error = new Error('blah')
  const req = buildReq()
  const res = buildRes({headersSent: true})
  const next = buildNext()

  errorMiddleware(error, req, res, next)
  expect(next).toHaveBeenCalledWith(error)
  expect(next).toHaveBeenCalledTimes(1)
  expect(res.status).not.toHaveBeenCalled()
  expect(res.json).not.toHaveBeenCalled()
})

test('responds with 500 and the error object', () => {
  const error = new Error('blah')
  const req = buildReq()
  const res = buildRes()
  const next = buildNext()

  errorMiddleware(error, req, res, next)
  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(500)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    message: error.message,
    stack: error.stack,
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})
