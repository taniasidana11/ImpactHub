import { Response } from 'express';
import Event from '../models/Event';
import User from '../models/User';
import { AuthRequest } from '../types/index';

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private — Volunteer only
const registerForEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.status !== 'Upcoming') {
      res.status(400).json({
        message: 'Registration is only available for upcoming events',
      });
      return;
    }

    const alreadyRegistered = event.participants.some(
      (participant) => participant.toString() === req.user!._id.toString()
    );

    if (alreadyRegistered) {
      res.status(400).json({
        message: 'You are already registered for this event',
      });
      return;
    }

    event.participants.push(req.user._id);
    await event.save();

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { registeredEvents: event._id } },
      { returnDocument: 'after' }
    );

    res.status(201).json({
      message: 'Successfully registered for the event',
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Cancel registration for an event
// @route   DELETE /api/events/:id/register
// @access  Private — Volunteer only
const cancelRegistration = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const isRegistered = event.participants.some(
      (participant) => participant.toString() === req.user!._id.toString()
    );

    if (!isRegistered) {
      res.status(400).json({
        message: 'You are not registered for this event',
      });
      return;
    }

    event.participants = event.participants.filter(
      (participant) => participant.toString() !== req.user!._id.toString()
    );
    await event.save();

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { registeredEvents: event._id } },
      { returnDocument: 'after' }
    );

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get all events registered by logged in volunteer
// @route   GET /api/volunteers/events
// @access  Private — Volunteer only
const getMyEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user._id).populate({
      path: 'registeredEvents',
      populate: {
        path: 'ngo',
        select: 'name contactEmail',
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user.registeredEvents);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export { registerForEvent, cancelRegistration, getMyEvents };