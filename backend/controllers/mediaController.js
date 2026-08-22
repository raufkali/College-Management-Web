const Media = require('../models/Media');

exports.getAllMedia = async (req, res, next) => {
  try {
    const gallery = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(gallery);
  } catch (err) { next(err); }
};

exports.uploadMediaItem = async (req, res, next) => {
  try {
    const upload = new Media(req.body);
    const saved = await upload.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

exports.deleteMediaItem = async (req, res, next) => {
  try {
    const target = await Media.findByIdAndDelete(req.params.id);
    if (!target) return res.status(404).json({ message: "Media asset ID matching target missing" });
    res.status(200).json({ success: true, message: "Media file scrubbed from archival indexes." });
  } catch (err) { next(err); }
};