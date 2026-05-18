const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/userAuthMiddleware');

router.get('/profile', authMiddleware, userController.getUserProfileByJwt);
router.post('/address', authMiddleware, userController.addAddressToUser);
router.delete('/address/:id', authMiddleware, userController.removeAddressFromUser);

module.exports = router;
