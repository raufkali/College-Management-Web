const Faculty = require('../models/Faculty');

exports.getAllFaculty = async (req, res, next) => {
  try {
    const profiles = await Faculty.find().sort({ name: 1 });
    res.status(200).json(profiles);
  } catch (err) { next(err); }
};

exports.addFacultyProfile = async (req, res, next) => {
  try {
    const profile = new Faculty(req.body);
    const saved = await profile.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

exports.removeFacultyProfile = async (req, res, next) => {
  try {
    const target = await Faculty.findByIdAndDelete(req.params.id);
    if (!target) return res.status(404).json({ message: "Profile entry location missing" });
    res.status(200).json({ success: true, message: "Faculty member purged successfully." });
  } catch (err) { next(err); }
};