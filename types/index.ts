import { Request } from 'express'

export interface LoginRequest {
    email: string;
    password: string;
}

export interface IGenerateRequest {
    url: string;
}

export interface TypedRequest<T> extends Request {
    body: T
}
