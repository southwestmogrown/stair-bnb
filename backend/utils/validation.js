const { validationResult } = require("express-validator");

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const bookingDateValidator = (startDate, endDate, next) => {
  const today = Date.now();
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  const dateErr = new Error();

  dateErr.status = 400;
  dateErr.message = "Bad Request";
  dateErr.errors = {};
  dateErr.stack = null;

  if (sDate.getTime() <= today) {
    dateErr.errors.startDate = "startDate cannot be in the past";
    return dateErr;
  }

  if (eDate.getTime() <= sDate.getTime()) {
    dateErr.errors.endDate = "endDate cannot be on or before startDate";
    return dateErr;
  }

  return null;
};

const validateSpotBooking = (spot, startDate, endDate, next) => {
  if (!spot) {
    spotError(next);
  }

  for (let booking of spot.Bookings) {
    const err = new Error();
    err.status = 403;
    err.errors = {};
    err.message = "Sorry, this spot is already booked for the specified dates";

    if (booking.startDate === startDate) {
      err.errors.startDate = "Start date conflicts with an existing booking";
      return err;
    }

    if (booking.endDate === endDate) {
      err.errors.startDate = "End date conflicts with an existing booking";
      return err;
    }
  }
};

const validateBookingDates = (booking, startDate, endDate, next) => {
  const err = new Error();
  err.status = 403;
  err.errors = {};
  err.message = "Sorry, this spot is already booked for the specified dates";

  const bookingStartDate = new Date(booking.startDate);
  const sDate = new Date(startDate);
  const bookingEndDate = new Date(booking.endDate);
  const eDate = new Date(endDate);

  if (bookingStartDate.getTime() === sDate.getTime()) {
    err.errors.startDate = "Start date conflicts with an existing booking";
    return err;
  }

  if (bookingEndDate.getTime() === eDate.getTime()) {
    err.errors.startDate = "End date conflicts with an existing booking";
    return err;
  }

  return null;
};

const spotError = (next) => {
  const err = new Error("Spot couldn't be found");
  err.status = 404;
  err.stack = null;
  return next(err);
};

const validateBookingUpdate = (bookingToChange, next) => {
  const today = Date.now();
  const bookingEndDate = new Date(bookingToChange.endDate);

  if (today >= bookingToChange.endDate) {
    const err = new Error("Past bookings can't be modified");
    err.status = 403;
    err.stack = null;
    return err;
  }
  return null;
};

const bookingError = (next) => {
  const err = new Error("Booking couldn't be found");
  err.status = 404;
  err.stack = null;
  return next(err);
};

module.exports = {
  handleValidationErrors,
  bookingDateValidator,
  validateSpotBooking,
  spotError,
  validateBookingUpdate,
  validateBookingDates,
  bookingError,
};
