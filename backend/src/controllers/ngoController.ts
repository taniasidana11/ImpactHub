import { Response } from 'express';
import NGO from '../models/NGO';
import { AuthRequest } from '../types/index';

// @desc    Get all verified NGOs
// @route   GET /api/ngos
// @access  Public
const getAllNGOs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ngos = await NGO.find({ verified: true }).populate(
      'user',
      'name email'
    );
    res.json(ngos);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get single NGO by ID
// @route   GET /api/ngos/:id
// @access  Public
const getNGOById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ngo = await NGO.findById(req.params.id)
      .populate('user', 'name email')
      .populate('events');

    if (!ngo) {
      res.status(404).json({ message: 'NGO not found' });
      return;
    }

    res.json(ngo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get NGO profile of logged in NGO user
// @route   GET /api/ngos/me
// @access  Private — NGO only
const getMyNGO = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findOne({ user: req.user._id }).populate('events');

    if (!ngo) {
      res.status(404).json({ message: 'NGO profile not found' });
      return;
    }

    res.json(ngo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Create NGO profile
// @route   POST /api/ngos
// @access  Private — NGO only
const createNGO = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const existingNGO = await NGO.findOne({ user: req.user._id });
    if (existingNGO) {
      res.status(400).json({
        message: 'NGO profile already exists for this user',
      });
      return;
    }

    const { name, description, address, contactEmail, contactPhone } =
      req.body;

    const ngo = await NGO.create({
      user: req.user._id,
      name,
      description,
      address,
      contactEmail,
      contactPhone,
    });

    res.status(201).json(ngo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Update NGO profile
// @route   PUT /api/ngos/:id
// @access  Private — NGO only
const updateNGO = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      res.status(404).json({ message: 'NGO not found' });
      return;
    }

    if (ngo.user.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: 'Not authorized to update this NGO profile',
      });
      return;
    }

    const updatedNGO = await NGO.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    res.json(updatedNGO);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Delete NGO profile
// @route   DELETE /api/ngos/:id
// @access  Private — Admin only
const deleteNGO = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      res.status(404).json({ message: 'NGO not found' });
      return;
    }

    await ngo.deleteOne();
    res.json({ message: 'NGO profile removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export {
  getAllNGOs,
  getNGOById,
  getMyNGO,
  createNGO,
  updateNGO,
  deleteNGO,
};