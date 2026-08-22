const Principal = require('../models/Principal');

exports.getPrincipalDetails = async (req, res, next) => {
  try {
    let executive = await Principal.findOne();
    if (!executive) {
      executive = await Principal.create({
        name: "Dr. M. Aslam Khan",
        qualification: "PhD in Education Management",
        message: "I feel honoured to serve Government Degree College Gulabad...",
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
        vision: "To be a premier institution of higher learning...",
        mission: "To provide quality education that empowers students..."
      });
    }
    res.status(200).json(executive);
  } catch (err) { next(err); }
};

exports.updatePrincipalDetails = async (req, res, next) => {
  try {
    let executive = await Principal.findOne();
    if (executive) {
      executive = await Principal.findByIdAndUpdate(executive._id, req.body, { new: true, runValidators: true });
    } else {
      executive = new Principal(req.body);
      await executive.save();
    }
    res.status(200).json(executive);
  } catch (err) { next(err); }
};