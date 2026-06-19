const multer     = require('multer');
const cloudinary = require('../config/cloudinary');
const AppError   = require('../utils/AppError');

// Use memory storage — upload buffer directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new AppError('Only image files are allowed.', 400), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB
});

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {string} folder  - e.g. 'products', 'avatars', 'sellers'
 * @returns {Promise<{url, public_id}>}
 */
const uploadToCloudinary = (buffer, folder = 'mhd-store') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary by public_id
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
