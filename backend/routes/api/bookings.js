const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { Booking, Spot } = require("../../db/models");

const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const currentBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: Spot,
        attributes: { exclude: ["createdAt, updatedAt"] },
      },
    ],
  });

  if (!currentBookings.length) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    err.stack = null;
    return next(err);
  }

  const bookingList = [];

  currentBookings.forEach((booking) => {
    bookingList.push(booking.toJSON());
  });

  bookingList.forEach((booking) => {});
});

module.exports = router;
