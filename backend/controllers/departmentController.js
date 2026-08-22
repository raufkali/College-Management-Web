const Department = require('../models/Department');

exports.getDepartments = async (req, res, next) => {
  try {
    const data = await Department.find().sort({ name: 1 });
    res.status(200).json(data);
  } catch (err) { next(err); }
};

exports.createDepartment = async (req, res, next) => {
  try {
    const entry = new Department(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const target = await Department.findByIdAndDelete(req.params.id);
    if (!target) return res.status(404).json({ message: "Record index missing" });
    res.status(200).json({ success: true, message: "Department index dropped successfully." });
  } catch (err) { next(err); }
};