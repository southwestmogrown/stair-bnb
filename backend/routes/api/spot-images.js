const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { SpotImage } = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const imageToDelete = await SpotImage.findByPk(req.params.imageId);

  if (imageToDelete.userId !== req.user.id) {
    const err = new Error("This image is not yours");
    err.status = 403;
    err.stack = null;
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
