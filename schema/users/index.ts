import { Schema, Types, model } from 'mongoose'

interface IUser {
    email: string;
    password: string;
    urls?: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    urls: { type: Schema.Types.ObjectId, ref: 'url'},
}, {timestamps: true})

export const User = model<IUser>('user', userSchema)