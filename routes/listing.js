const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, isValidate } = require("../middleware.js")
const listingController = require("../controllers/listing.js");

const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing))

router.get("/create", isLoggedIn, listingController.renderCreate)
router.route("/:id")
    .put(isLoggedIn, isOwner, isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy))

router.get("/show/:id", wrapAsync(listingController.showListing))

router.get("/edit/:id", isLoggedIn, wrapAsync(listingController.editForm))


module.exports = router;