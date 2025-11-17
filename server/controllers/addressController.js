import asyncHandler from 'express-async-handler';
import Address from '../models/Address.js';

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1 });
  res.json(addresses);
});

// @desc    Create address
// @route   POST /api/addresses
// @access  Private
export const createAddress = asyncHandler(async (req, res) => {
  const address = await Address.create({
    user: req.user._id,
    ...req.body,
  });

  res.status(201).json(address);
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  Object.keys(req.body).forEach((key) => {
    address[key] = req.body[key];
  });

  const updatedAddress = await address.save();
  res.json(updatedAddress);
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  await address.deleteOne();
  res.json({ message: 'Address removed' });
});

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  address.isDefault = true;
  await address.save();

  res.json(address);
});
