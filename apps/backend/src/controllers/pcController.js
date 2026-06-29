const Joi = require("joi");
const PC = require("../models/PC");

const createSchema = Joi.object({
  label: Joi.string().required(),
  specs: Joi.object({
    cpu: Joi.string().allow(""),
    gpu: Joi.string().allow(""),
    ram: Joi.string().allow(""),
    monitor: Joi.string().allow(""),
  }).optional(),
  position: Joi.object({
    row: Joi.number().default(0),
    col: Joi.number().default(0),
  }).optional(),
});

exports.listPCs = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const cafeId = req.user.cafeId;
    const filter = { cafeId };
    if (status) filter.status = status;
    if (search) filter.label = new RegExp(search, "i");
    const pcs = await PC.find(filter).sort({
      "position.row": 1,
      "position.col": 1,
      label: 1,
    });
    res.json({ pcs });
  } catch (err) {
    next(err);
  }
};

exports.createPC = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const pc = await PC.create({ cafeId: req.user.cafeId, ...value });
    res.status(201).json({ pc });
  } catch (err) {
    next(err);
  }
};

exports.updatePC = async (req, res, next) => {
  try {
    const pc = await PC.findOneAndUpdate(
      { _id: req.params.id, cafeId: req.user.cafeId },
      req.body,
      { new: true },
    );
    if (!pc) return res.status(404).json({ message: "PC not found" });
    res.json({ pc });
  } catch (err) {
    next(err);
  }
};

exports.setStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (
      !["free", "locked", "maintenance", "offline", "active"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid PC status" });
    }

    const pc = await PC.findOneAndUpdate(
      { _id: req.params.id, cafeId: req.user.cafeId },
      { status },
      { new: true },
    );
    if (!pc) return res.status(404).json({ message: "PC not found" });
    res.json({ pc });
  } catch (err) {
    next(err);
  }
};
