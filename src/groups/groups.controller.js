const groupsService = require("./groups.service");

async function createGroup(req, res, next) {
  try {
    const group = await groupsService.createGroup(req.user.id, req.body.name);
    return res.status(201).json(group);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createGroup,
};
