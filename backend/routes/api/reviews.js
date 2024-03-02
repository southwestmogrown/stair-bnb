const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { requireAuth } = require("../../utils/auth");

const {
  Review,
  User,
  Spot,
  ReviewImage,
  SpotImage,
} = require("../../db/models");

const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const currentUserID = req.user.id;

  const userReviews = await Review.findAll({
    where: {
      userId: currentUserID,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: SpotImage,
          attributes: ["url"],
        },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  const reviewList = [];

  userReviews.forEach((review) => {
    reviewList.push(review.toJSON());
  });

  reviewList.forEach((review) => {
    review.Spot.SpotImages.forEach((image) => {
      review.previewImage = image.url;
    });

    review.createdAt = new Date(review.createdAt).toUTCString();
    review.updatedAt = new Date(review.updatedAt).toUTCString();

    delete review.Spot.SpotImages;
  });

  res.json(reviewList);
});

router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId, {
    include: {
      model: Spot,
      include: SpotImage,
    },
  });

  if (!review) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    err.title = "Review doesn't exist";
    err.stack = null;
    next(err);
  }

  const safeReview = review.toJSON();

  if (safeReview.Spot.SpotImages >= 10) {
    const err = new Error(
      "Maximum number of images for this resource was reached"
    );
    err.status = 403;
    err.title = "SpotImage Overflow";
    err.stack = null;
    next(err);
  }

  const { url, preview } = req.body;

  const newSpotImage = await SpotImage.create({
    spotId: safeReview.spotId,
    url,
    preview,
  });

  res.json({
    id: newSpotImage.id,
    url: newSpotImage.url,
  });
});

const validateUpdateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

router.put(
  "/:reviewId",
  requireAuth,
  validateUpdateReview,
  async (req, res, next) => {
    const reviewToUpdate = await Review.findByPk(req.params.reviewId);
    const { review, stars } = req.body;

    if (!reviewToUpdate) {
      const err = new Error("Review couldn't be found");
      err.status = 404;
      err.title = "Review doesn't exist";
      err.stack = null;
      next(err);
    }

    if (review !== undefined) reviewToUpdate.review = review;
    if (stars !== undefined) reviewToUpdate.stars = stars;

    await reviewToUpdate.save();

    const obj = reviewToUpdate.toJSON();

    obj.createdAt = new Date(obj.createdAt).toUTCString();
    obj.updatedAt = new Date(obj.updatedAt).toUTCString();

    res.json(obj);
  }
);

router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const reviewToDelete = await Review.findByPk(req.params.reviewId);

  if (!reviewToDelete) {
    const err = new Error("Review couldn't be found");
    err.status = 404;
    err.title = "Review doesn't exist";
    err.stack = null;
    next(err);
  }

  await reviewToDelete.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
