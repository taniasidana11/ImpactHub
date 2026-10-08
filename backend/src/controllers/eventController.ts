import { Response } from 'express';
import Event from '../models/Event';
import NGO from '../models/NGO';
import { AuthRequest } from '../types/index';

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const filter: Record<string, unknown> = { status: 'Upcoming' };

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    if (req.query.date) {
      filter.date = { $gte: new Date(req.query.date as string) };
    }

    const events = await Event.find(filter)
      .populate('ngo', 'name contactEmail')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('ngo', 'name description contactEmail address')
      .populate('participants', 'name email');

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private — NGO only
const createEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findOne({ user: req.user._id });

    if (!ngo) {
      res.status(404).json({ message: 'NGO profile not found' });
      return;
    }

    if (!ngo.verified) {
      res.status(403).json({
        message: 'Your NGO must be verified before posting events',
      });
      return;
    }

    const { title, description, date, time, location } = req.body;

    const event = await Event.create({
      title,
      description,
      ngo: ngo._id,
      date,
      time,
      location,
    });

    ngo.events.push(event._id);
    await ngo.save();

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private — NGO only
const updateEvent = async (
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

    const ngo = await NGO.findOne({ user: req.user._id });

    if (!ngo) {
      res.status(404).json({ message: 'NGO profile not found' });
      return;
    }

    if (event.ngo.toString() !== ngo._id.toString()) {
      res.status(403).json({
        message: 'Not authorized to update this event',
      });
      return;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private — NGO and Admin
const deleteEvent = async (
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

    if (req.user.role === 'NGO') {
      const ngo = await NGO.findOne({ user: req.user._id });

      if (!ngo || event.ngo.toString() !== ngo._id.toString()) {
        res.status(403).json({
          message: 'Not authorized to delete this event',
        });
        return;
      }

      ngo.events = ngo.events.filter(
        (e) => e.toString() !== event._id.toString()
      );
      await ngo.save();
    }

    await event.deleteOne();
    res.json({ message: 'Event removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};