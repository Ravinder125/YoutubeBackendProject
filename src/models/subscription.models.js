import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: { type: Schema.Types.ObjectId, ref: 'User', default: [], index: true }, // one whom is subscribing
    channels: { type: Schema.Types.ObjectId, ref: 'User', default: [], index: true }, // One to who is subscribing 

}, { timestamps: true })


const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription; 