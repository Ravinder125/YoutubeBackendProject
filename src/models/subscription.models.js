import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: { type: Schema.Types.ObjectId, ref: 'User', index: true }, // one whom is subscribing
    channel: { type: Schema.Types.ObjectId, ref: 'User', index: true }, // One to who is subscribing 

}, { timestamps: true })


export const Subscription = mongoose.model('Subscription', subscriptionSchema);
