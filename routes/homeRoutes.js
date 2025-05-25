const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const homeController = require('../controllers/homeController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', homeController.getHome);
router.get('/postlist', homeController.getPostList);
router.get('/postnotice', homeController.getPostNotice);
router.post('/postnotice', upload.single('image'), homeController.postPostNotice);
router.get('/settings', homeController.getSettings);
router.post('/settings', upload.single('profilePic'), homeController.postSettings);

router.get('/postcomment/:postId', homeController.getPostComment);
router.post('/postcomment', homeController.postPostComment);

module.exports = router;
