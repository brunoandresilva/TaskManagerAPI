const groupsService = require("./groups.service");

async function createGroup(req, res, next) {
  try {
    const group = await groupsService.createGroup(req.user.id, req.body.name);
    return res.status(201).json(group);
  } catch (error) {
    return next(error);
  }
}

async function deleteGroup(req, res, next) {
  try {
    await groupsService.deleteGroup(req.params.id, req.user.id);
    console.log("Final");
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createGroup,
  deleteGroup,
};
