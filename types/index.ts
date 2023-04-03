import { Request, Express } from 'express'

export interface LoginRequest {
    email: string;
    password: string;
}

export interface TypedRequest<T> extends Express.Request {
    body: T
}
