const PG = require('../../models/owners/PG.Model');

exports.addPG = async (req, res) => {
  const pg = new PG({ ...req.body, ownerId: req.user.id });
  await pg.save();
  res.status(201).json(pg);
};

exports.getPGs = async (req, res) => {
  const pgs = await PG.find({ ownerId: req.user.id });
  res.json(pgs);
};

exports.updatePG = async (req, res) => {
  const { pgId } = req.params;
  const updated = await PG.findByIdAndUpdate(pgId, req.body, { new: true });
  res.json(updated);
};
