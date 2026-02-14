
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  publicId: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Image', ImageSchema);
