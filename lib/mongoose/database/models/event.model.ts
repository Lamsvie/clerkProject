import { model, models, Schema } from "mongoose";


const EventSchemma = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    location: { type: String },
    createdAt: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    startDateTime: { type: Date, default: Date.now },
    endDateTime: { type: Date, default: Date.now  },
    price: { type: String },
    isFree: { type: Boolean },
    url: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    organizer: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Event = models.Event || model('Event', EventSchemma)

export default Event;