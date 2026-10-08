import mongoose, { Schema } from 'mongoose';
import { IEvent } from '../types/index';

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an event description'],
    },
    ngo: {
      type: Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    time: {
      type: String,
      required: [true, 'Please add an event time'],
    },
    location: {
      type: String,
      required: [true, 'Please add an event location'],
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>('Event', eventSchema);