const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { ReviewImage } = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const reviewImageToDelete = await ReviewImage.findByPk(req.params.imageId);

  if (reviewImageToDelete.userId !== req.user.id) {
    const err = new Error("This image is not yours");
    err.status = 403;
    err.stack = null;
    return next(err);
  }

  if (!reviewImageToDelete) {
    const err = new Error("Review image couldn't be found");
    err.status = 404;
    err.stack = null;
    return next(err);
  }

  await reviewImageToDelete.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
