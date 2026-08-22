const express = require('express');
const router = express.Router();
const { getAllMedia, uploadMediaItem, deleteMediaItem } = require('../controllers/mediaController');

router.route('/').get(getAllMedia).post(uploadMediaItem);
router.route('/:id').delete(deleteMediaItem);

module.exports = router;