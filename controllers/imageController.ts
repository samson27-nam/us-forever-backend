
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Image from '../models/Image';

// Configure Cloudinary from env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

/**
 * @desc    Fetch all images
 * @route   GET /api/images
 */
// Using any for res to avoid "Property 'status' does not exist" errors
export const getImages = async (req: Request, res: any) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch images'
    });
  }
};

/**
 * @desc    Upload image to Cloudinary and save URL to DB
 * @route   POST /api/images/upload
 */
// Using any for req and res to handle properties added by middleware (like req.file) and fix "Property 'status' does not exist" errors
export const uploadImage = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload an image' });
    }

    const { title } = req.body;

    // Convert buffer to base64 for Cloudinary upload
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'our_memories',
      resource_type: 'auto'
    });

    // Save to MongoDB
    const newImage = await Image.create({
      url: result.secure_url,
      publicId: result.public_id,
      title: title || 'Untitled'
    });

    res.status(201).json({
      success: true,
      data: newImage
    });
  } catch (error) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Image upload failed'
    });
  }
};
