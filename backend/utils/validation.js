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

    const bookingStartDate = new Date(booking.startDate);
    const inputStartDate = new Date(startDate);
    const bookingEndDate = new Date(booking.endDate);
    const inputEndDate = new Date(endDate);
    if (bookingStartDate.getTime() === inputStartDate.getTime()) {
      err.errors.startDate = "Start date conflicts with an existing booking";
      return err;
    }

    if (inputStartDate.getTime() === bookingEndDate.getTime()) {
      err.errors.startDate = "Start date conflicts with an existing booking";
      return err;
    }

    if (bookingEndDate.getTime() === inputEndDate.getTime()) {
      err.errors.startDate = "End date conflicts with an existing booking";
      return err;
    }

    if (bookingStartDate.getTime() === inputEndDate.getTime()) {
      console.log("here");
      err.errors.startDate = "End date conflicts with an existing booking";
      return err;
    }

    if (
      inputStartDate.getTime() > bookingStartDate &&
      inputStartDate < bookingEndDate
    ) {
      err.errors.startDate = "Start date conflicts with an existing booking";
      return err;
    }

    if (
      inputEndDate.getTime() > bookingStartDate &&
      inputEndDate < bookingEndDate
    ) {
      err.errors.startDate = "End date conflicts with an existing booking";
      return err;
    }

    if (inputStartDate < bookingStartDate && inputEndDate > bookingEndDate) {
      err.errors.startDate =
        "Start and end dates conflicts with an existing booking";
      return err;
    }
  }
};

const validateOtherBookings = (booking, startDate, endDate) => {
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
  if (bookingStartDate.getTime() === eDate.getTime()) {
    err.errors.startDate = "Start date conflicts with an existing booking";
    return err;
  }

  if (bookingEndDate.getTime() === eDate.getTime()) {
    err.errors.startDate = "End date conflicts with an existing booking";
    return err;
  }
  if (bookingEndDate.getTime() === sDate.getTime()) {
    err.errors.startDate = "End date conflicts with an existing booking";
    return err;
  }

  if (sDate.getTime() > bookingStartDate && sDate < bookingEndDate) {
    err.errors.startDate = "Start date conflicts with an existing booking";
    return err;
  }

  if (eDate.getTime() > bookingStartDate && eDate < bookingEndDate) {
    err.errors.startDate = "End date conflicts with an existing booking";
    return err;
  }

  if (sDate < bookingStartDate && eDate > bookingEndDate) {
    err.errors.startDate =
      "Start and end dates conflicts with an existing booking";
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
  bookingError,
  validateOtherBookings,
};
