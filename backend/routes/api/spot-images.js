const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { SpotImage } = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const imageToDelete = await SpotImage.findByPk(req.params.imageId);

  if (imageToDelete.userId !== req.user.id) {
    const err = new Error("You must own a spot to delete it's images");
    err.status = 403;
    err.title = "Spot Image Delete Failed";
    err.errors = {
      authorization: "You are not authorized for this action",
    };
    return next(err);
  }

  if (!imageToDelete) {
    const err = new Error("Spot image couldn't be found");
    err.status = 404;
    err.stack = null;
    return next(err);
  }

  await imageToDelete.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
