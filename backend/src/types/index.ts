import { Request } from 'express';
import { Document, Types } from 'mongoose';

// User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'NGO' | 'Volunteer';
  registeredEvents: Types.ObjectId[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// NGO interface
export interface INGO extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  mission?: string;
  description: string;
  about?: string;
  address: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  profileImage?: string;
  coverImage?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  verified: boolean;
  events: Types.ObjectId[];
}

// Event interface
export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  ngo: Types.ObjectId;
  date: Date;
  time: string;
  location: string;
  participants: Types.ObjectId[];
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
}

// Extended Request interface with user
export interface AuthRequest extends Request {
  user?: IUser;
}