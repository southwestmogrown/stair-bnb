const express = require("express");

const { Spot, SpotImage, User } = require("../../db/models");

const router = express.Router();

router.get("/", async (req, res) => {
  const spots = await Spot.findAll();

  res.json({
    Spots: spots,
  });
});

router.get("/current", async (req, res) => {
  const user = req.user;
  const userSpots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
  });
  res.json({
    Spots: userSpots,
  });
});

router.get("/:spotId", async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const spotImages = await SpotImage.findAll({
    where: {
      spotId: spot.id,
    },
  });

  const owner = await User.findByPk(spot.ownerId);

  const safeObj = {
    ...spot.toJSON(),
    SpotImages: spotImages,
    Owner: owner,
  };

  res.json(safeObj);
});

module.exports = router;
