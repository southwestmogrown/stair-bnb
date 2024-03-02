const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { Booking, Spot, SpotImage } = require("../../db/models");
const {
  spotError,
  bookingDateValidator,
  validateBookingUpdate,
  validateSpotBooking,
  validateBookingDates,
  bookingError,
} = require("../../utils/validation");

const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const currentBookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: Spot,
        attributes: [
          "address",
          "city",
          "country",
          "description",
          "id",
          "lat",
          "lng",
          "name",
          "price",
          "state",
        ],
        include: [
          {
            model: SpotImage,
            attributes: { exclude: ["createdAt, updatedAt"] },
          },
        ],
      },
    ],
  });

  if (!currentBookings.length) {
    spotError(next);
  }

  const bookingList = [];

  currentBookings.forEach((booking) => {
    bookingList.push(booking.toJSON());
  });

  bookingList.forEach((booking) => {
    booking.Spot.SpotImages.forEach((image) => {
      booking.previewImage = image.url;
    });

    delete booking.Spot.SpotImages;
  });

  res.json({ Bookings: bookingList });
});

router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingToChange = await Booking.findByPk(req.params.bookingId);
  const { startDate, endDate } = req.body;

  if (!bookingToChange) {
    bookingError(next);
  }

  const bookingErr = bookingDateValidator(startDate, endDate);
  console.log(bookingErr);

  if (bookingErr) return next(bookingErr);

  const updateError = validateBookingUpdate(bookingToChange);

  if (updateError) return next(updateError);

  const bookingDateError = validateBookingDates(
    bookingToChange,
    startDate,
    endDate
  );
  if (bookingDateError) return next(bookingDateError);

  if (startDate !== undefined) bookingToChange.startDate = startDate;
  if (endDate !== undefined) bookingToChange.endDate = endDate;

  await bookingToChange.save();

  res.json(bookingToChange);
});

router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingToDelete = await Booking.findByPk(req.params.bookingId);

  if (!bookingToDelete) {
    bookingError(next);
  }

  const today = Date.now();
  const sDate = new Date(bookingToDelete.startDate);

  if (today >= sDate.getTime()) {
    const err = new Error("Bookings that have been started can't be deleted");
    err.status = 403;
    err.stack = null;
    return next(err);
  }

  await bookingToDelete.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
