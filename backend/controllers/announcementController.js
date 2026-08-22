const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res, next) => {
  try {
    const notices = await Announcement.find().sort({ date: -1 });
    res.status(200).json(notices);
  } catch (err) { next(err); }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const notice = new Announcement(req.body);
    const saved = await notice.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const notice = await Announcement.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not located" });
    res.status(200).json({ success: true, message: "Notice item cleared from grid." });
  } catch (err) { next(err); }
};