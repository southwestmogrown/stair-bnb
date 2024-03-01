const express = require("express");

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

module.exports = router;
