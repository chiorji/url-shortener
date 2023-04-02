import { Schema, Types, model } from 'mongoose';

interface IUrl {
    clickCount: number;
    owner: Types.ObjectId;
}

const urlSchema = new Schema<IUrl>({
    clickCount: { type: Number, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: 'user' },
}, {timestamps: true})

export const Url = model<IUrl>('url', urlSchema);