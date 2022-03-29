import {Schema, model, Document } from 'mongoose';

interface IssueInt {
    title: string,
    body: string,
    user: {},
    threadId: string
}

const IssueSchema = new Schema({
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    user: { type: Object, required: true, trim: true },
    threadId: { type: String, required: true, trim: true }
}, { timestamps:true})

export default model<IssueInt>('issue', IssueSchema);