const router  = require('express').Router();
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const catchAsync = require('../utils/catchAsync');
const AppError   = require('../utils/AppError');

// General single-image upload
router.post('/image',
  protect,
  upload.single('image'),
  catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError('No file uploaded.', 400));
    const folder = req.query.folder || 'general';
    const { url, public_id } = await uploadToCloudinary(req.file.buffer, folder);
    res.json({ success: true, data: { url, public_id } });
  })
);

// Multiple images upload (up to 10)
router.post('/images',
  protect,
  upload.array('images', 10),
  catchAsync(async (req, res, next) => {
    if (!req.files?.length) return next(new AppError('No files uploaded.', 400));
    const folder   = req.query.folder || 'general';
    const results  = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer, folder)));
    res.json({ success: true, data: results });
  })
);

module.exports = router;
