/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('../models/User');
const Post = require('../models/Post');

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    // Returns all user objects other than password and updatedAt
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(`Error: ${err}`);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, {
      $set: req.body,
    });
    await user.save();
    res.status(200).json('Account has been updated');
  } catch (err) {
    res.status(500).json(`Error: ${err}`);
  }
};

module.exports.deleteUser = async (req, res) => {
  // Check if the user is deleting its own account
  try {
    await User.findByIdAndDelete(req.userId);
    res.status(200).json('Account has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.followUser = async (req, res) => {
  try {
    // executing query to check if the
    const user = await User.findById(req.body.followUserId);
    if (!user) {
      res.status(404).json('User not found');
    } else {
      const Currentuser = await User.findById(req.userId);

      if (!Currentuser.following.includes(user._id)) {
        await Currentuser.updateOne({ $push: { following: user._id } });
        await user.updateOne({ $push: { followers: req.userId } });
        res.status(200).json('User followed');
      } else res.status(403).json('You already follow this user');
    }
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
};

module.exports.unFollowUser = async (req, res) => {
  try {
    const unfollowUser = await User.findById(req.body.unfollowUserId);
    if (!unfollowUser) {
      res.status(404).json('User not found');
    } else {
      const CurrentUser = await User.findById(req.userId);
      if (CurrentUser.following.includes(unfollowUser._id)) {
        await CurrentUser.updateOne({ $pull: { following: unfollowUser._id } });
        await unfollowUser.updateOne({ $pull: { followers: CurrentUser._id } });
        res.status(200).json('User unfollowed');
      } else res.status(403).json("You don't follow this user");
    }
  } catch (error) {
    return res.status(500).json(`Error: ${error}`);
  }
};

module.exports.postModeration = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page = 1, limit = 6 } = req.query;
    // get total documents in the Posts collection
    const totalItems = await Post.find({}).countDocuments();

    // execute query with page and limit values
    const posts = await Post.find({ userId: { $nin: [req.userId] } })
      .limit(limit * 1)
      .skip((page - 1) * page)
      .sort({ createdAt: -1 })
      .select('-userId -likes -createrName -updatedAt -__v')
      .exec();
    // return response with posts, total pages, and current page
    res.status(200).json({
      posts,
      totalPages: Math.ceil((totalItems / limit)),
      CurrentPage: page,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.pageRender = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      if (!user.isPaid) {
        res.render('home', {
          key: process.env.STRIPE_PUBLIC_KEY,
        });
      } else {
        res.status(200).json('You are already a premium member');
      }
    } else {
      res.status(404).json('User doesnot exists');
    }
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
};

module.exports.payment = async (req, res) => {
  try {
    const StripeToken = await stripe.tokens.create({
      card: {
        number: req.body.number,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year,
        cvc: req.body.cvc,
      },
    });
    const user = await User.findById(req.userId);
    stripe.customers.create({
      source: StripeToken.id,
      name: user.fullname,
      id: user._id,
      address: {
        line1: 'temp',
        postal_code: '0000',
        city: 'temp',
        state: 'temp',
        country: 'temp',
      },
    })
      .then((customer) => stripe.charges.create({
        amount: 2000, // Charging 20 dollars
        description: 'Premium Membership Subscription',
        currency: 'USD',
        customer: customer.id,
      }))
      .then(async () => {
        user.isPaid = true;
        await user.save();
        res.status(200).json('Payment Succesfull'); // If no error occurs
      })
      .catch((err) => {
        res.send(err); // If some error occurs
      });
  } catch (error) {
    res.status(500).json(`Error: ${error}`);
  }
};
