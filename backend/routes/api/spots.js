const express = require("express");

const { Spot, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.get("/", async (req, res) => {
  const spots = await Spot.findAll();

  res.json({
    Spots: spots,
  });
});

router.get("/current", requireAuth, async (req, res) => {
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

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({
      max: 90,
      min: -90,
    })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({
      max: 180,
      min: -180,
    })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

router.post("/", validateSpot, requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  res.status(201);
  res.json(newSpot);
});

router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    const err = new Error("Resource not found");
    err.status = 404;
    err.title = "Resource not found";
    return next(err);
  }

  if (spot.ownerId !== req.user.id) {
    const err = new Error("You must own a spot to add an image");
    err.status = 403;
    err.title = "Image Creation Failed";
    err.errors = {
      authorization: "You are not authorized for this action",
    };
    return next(err);
  }

  const newImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  });
});

router.put("/:spotId", requireAuth, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const spotToUpdate = await Spot.findByPk(req.params.spotId);

  if (!spotToUpdate) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.stack = null;
    return res.json({
      message: err.message,
    });
  }

  if (address !== undefined) spotToUpdate.address = address;
  if (city !== undefined) spotToUpdate.city = city;
  if (state !== undefined) spotToUpdate.state = state;
  if (country !== undefined) spotToUpdate.country = country;
  if (lat !== undefined) spotToUpdate.lat = lat;
  if (lng !== undefined) spotToUpdate.lng = lng;
  if (name !== undefined) spotToUpdate.name = name;
  if (description !== undefined) spotToUpdate.description = description;
  if (price !== undefined) spotToUpdate.price = price;

  await spotToUpdate.save();

  res.json(spotToUpdate);
});

router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spotToDelete = await Spot.findByPk(req.params.spotId);

  if (!spotToDelete) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.stack = null;
    return res.json({
      message: err.message,
    });
  }

  await spotToDelete.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
