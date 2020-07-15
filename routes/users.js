var express = require("express");
var router = express.Router();
const uploader = require("./../config/cloudinary");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");
const exposeFlashMessage = require("./../middlewares/exposeFlashMessage");

const activityModel = require("../models/Activities");
const sportModel = require("../models/Sports");
const userModel = require("../models/Users");
const reviewModel = require("../models/Reviews");

// **************************************
// ALL ROUTES ARE PREFIXED WITH /USER
// **************************************

// ACCESS USER ACCOUNT  ===> PROTECT

<<<<<<< HEAD
router.get("/account/:id", protectPrivateRoute,  (req, res, next) => {
	userModel
		.findById(req.params.id)
		.populate("sports.sport")
		.then((user) => {
			res.render("user/user-account", {
				title: `${user.firstName}'s account`,
				user,
			});
		})
		.catch(next);
=======
router.get("/account/:id", protectPrivateRoute, (req, res, next) => {
  userModel
    .findById(req.params.id)
    .populate("sports.sport")
    .then((user) => {
      res.render("user/user-account", {
        title: `${user.firstName}'s account`,
        user,
      });
    })
    .catch(next);
>>>>>>> validation of participants on my activities
});

// UPDATE USER ACCOUNT  ===> PROTECT

router.get("/edit-account/:id", protectPrivateRoute, (req, res, next) => {
  userModel
    .findById(req.params.id)
    .populate("sports.sport")
    .then((user) => {
      res.render("user/update-account", {
        title: `Update ${user.firstName}'s account`,
        user,
      });
    })
    .catch(next);
});

router.post(
  "/edit-account/:id",
  protectPrivateRoute,
  uploader.single("picture"),
  (req, res, next) => {
    const updatedUser = req.body;
    if (req.file) updatedUser.picture = req.file.path;

    userModel
      .findByIdAndUpdate(req.params.id, updatedUser)
      .populate("sports.sport")
      .then((user) => {
        res.redirect(`/user/profile/${updatedUser.id}`);
      })
      .catch(next);
  }
);

// DELETE USER ACCOUNT

// ask for confirmation
router.get("/confirm-delete/:id", protectPrivateRoute, (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((user) => {
      res.render("user/user-confirm-delete", { title: "Delete account", user });
    })
    .catch(next);
});

// delete for real
router.post("/delete-account/:id", protectPrivateRoute, (req, res, next) => {
  userModel
    .findByIdAndDelete(req.params.id)
    .then((dbRes) => {
      req.flash("success", "account successfully deleted");
      res.redirect("/auth/signout");
    })
    .catch(next);
});

// USER PROFILE

router.get("/profile/:id", (req, res, next) => {
  Promise.all([
    userModel.findById(req.params.id),
    reviewModel.find().populate("reviewedUser reviewerName"),
  ])
    .then((dbRes) => {
      res.render("user/user-profile", {
        user: dbRes[0],
        review: dbRes[1],
      });
    })
    .catch(next);
});

// SEND USER REVIEWS
router.post("/reviews-for-:id", protectPrivateRoute, (req, res, next) => {
<<<<<<< HEAD
	const { reviewContent, rate } = req.body;

	reviewModel
		.create({
			reviewedUser: req.params.id,
			reviewerName: req.session.currentUser._id,
			reviewContent,
			rate,
			date: Date.now,
		})
		.then((newReview) => {
			req.flash("success", "review added");
			res.redirect(`/user/profile/${req.params.id}`);
		})
		.catch(next);
=======
  const { reviewContent, rate } = req.body;

  reviewModel
    .create({
      reviewedUser: req.params.id,
      reviewerName: req.session.currentUser._id,
      reviewContent,
      rate,
      date: Date.now,
    })
    .then((newReview) => {
      req.flash("success", "review added");
      console.log("NEW REVIEW SENT ====>", newReview);
      res.redirect(`/user/profile/${req.params.id}`);
    })
    .catch(next);
>>>>>>> validation of participants on my activities
});

// USER ACTIVITIES ===> PROTECT

router.get("/activities/:id", protectPrivateRoute, (req, res, next) => {
  Promise.all([
    userModel.findById(req.params.id),
    activityModel
      .find({
        $or: [
          { "participants.participantID": req.params.id },
          { "participantsToApprove.participantID": req.params.id },
          { creator: req.params.id },
        ],
      })
      .populate(
        "participants.participantID creator sport participantsToApprove.participantID"
      ),
  ])
    .then((dbRes) => {
      let user = dbRes[0];
      console.log("------------User", user);
      let activity = dbRes[1];
      console.log("------------Activity", activity);
      let toApp = activity.filter(
        (act) => act.participantsToApprove.length > 0
      );
      console.log("------------Participants to approve", toApp);

      res.render("user/user-activities", {
        title: `${dbRes[0].firstName}'s activities`,
        user,
        activity,
        toApp,
      });
    })
    .catch(next);
});

module.exports = router;

/* FONCTIONNE BIEN :

	activityModel
			.find({ "participants.participantID": req.params.id })
			.populate("participants.participantID creator sport"),
		activityModel
			.find({ "creator": req.params.id })
			.populate("participants.participantID creator sport"),

*/
