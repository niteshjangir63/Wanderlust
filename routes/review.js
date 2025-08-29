const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isReviewAuthor ,isValidateReview} = require("../middleware.js")
const reviewController = require("../controllers/review.js");
 

router.post("/", isLoggedIn,isValidateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroy));


module.exports = router;

