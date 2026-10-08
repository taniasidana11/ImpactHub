import { Response } from 'express';
import User from '../models/User';
import NGO from '../models/NGO';
import Event from '../models/Event';
import { AuthRequest } from '../types/index';

// @desc    Get all NGO registration requests
// @route   GET /api/admin/ngos
// @access  Private — Admin only
const getAllNGORequests = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ngos = await NGO.find().populate('user', 'name email');
    res.json(ngos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Approve or reject an NGO
// @route   PUT /api/admin/ngos/:id/verify
// @access  Private — Admin only
const verifyNGO = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      res.status(404).json({ message: 'NGO not found' });
      return;
    }

    const { verified } = req.body;

    if (typeof verified !== 'boolean') {
      res.status(400).json({ message: 'verified field must be a boolean' });
      return;
    }

    ngo.verified = verified;
    await ngo.save();

    res.json({
      message: verified
        ? 'NGO approved successfully'
        : 'NGO rejected successfully',
      ngo,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private — Admin only
const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Remove a user
// @route   DELETE /api/admin/users/:id
// @access  Private — Admin only
const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user._id.toString() === req.user!._id.toString()) {
      res.status(400).json({ message: 'You cannot delete your own account' });
      return;
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Remove an event
// @route   DELETE /api/admin/events/:id
// @access  Private — Admin only
const deleteEventAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    await NGO.findByIdAndUpdate(event.ngo, {
      $pull: { events: event._id },
    });

    await User.updateMany(
      { registeredEvents: event._id },
      { $pull: { registeredEvents: event._id } }
    );

    await event.deleteOne();
    res.json({ message: 'Event removed successfully by admin' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private — Admin only
const getStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNGOs = await NGO.countDocuments();
    const verifiedNGOs = await NGO.countDocuments({ verified: true });
    const pendingNGOs = await NGO.countDocuments({ verified: false });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });

    res.json({
      totalUsers,
      totalNGOs,
      verifiedNGOs,
      pendingNGOs,
      totalEvents,
      upcomingEvents,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export {
  getAllNGORequests,
  verifyNGO,
  getAllUsers,
  deleteUser,
  deleteEventAdmin,
  getStats,
};