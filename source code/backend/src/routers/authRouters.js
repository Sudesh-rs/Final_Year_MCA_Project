const express = require('express');
const authController = require('../controllers/authController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// configure multer to store uploads in public/uploads
const uploadsDir = path.join(__dirname, '../../../frontend/public/uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

router.post('/sent/login-signup-otp', authController.sentLoginOtp);
router.post('/signup', upload.single('profileImage'), authController.createUserHandler);
router.post('/signin', authController.signin);

module.exports = router;