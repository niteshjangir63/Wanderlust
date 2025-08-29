const Listing = require("../models/listing")
const Review = require("../models/review")
module.exports.createReview = async (req, res) => {

    console.log(req)
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);


    await newReview.save();
    const result = await listing.save();

    console.log(result);
    req.flash("review", "Review Added Successfully!");
    res.redirect(`/listings/show/${listing._id}`)

}

module.exports.destroy = async (req, res) => {

    const { id, reviewId } = req.params;


    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findById(reviewId);
    req.flash("review", "Review Deleted Successfully!");
    res.redirect(`/listings/show/${id}`)
}