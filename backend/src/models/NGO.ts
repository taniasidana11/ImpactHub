import mongoose, { Schema } from 'mongoose';
import { INGO } from '../types/index';

const ngoSchema = new Schema<INGO>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add an NGO name'],
      trim: true,
    },
    mission: {
      type: String,
      trim: true,
      maxlength: [200, 'Mission statement cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    about: {
      type: String,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Please add a contact email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    contactPhone: {
      type: String,
    },
    website: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INGO>('NGO', ngoSchema);