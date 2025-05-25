const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const fs = require('fs');
const path = require('path');

exports.getHome = async (req, res) => {
  const posts = await Post.find();
  let userImage = 'user-icon.png';
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user && user.image) userImage = user.image;
  }
  res.render('home/home', { posts, userImage });
};

exports.getPostList = async (req, res) => {
  const posts = await Post.find();
  let userImage = 'user-icon.png';
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user && user.image) userImage = user.image;
  }
  res.render('home/postlist', { posts, userImage });
};

exports.getPostNotice = async (req, res) => {
  let userImage = 'user-icon.png';
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user && user.image) userImage = user.image;
  }
  res.render('home/postnotice', { userImage });
};

exports.postPostNotice = async (req, res) => {
  const image = req.file ? req.file.filename : null;
  const { title, content } = req.body;
  const post = new Post({ image, title, content });
  await post.save();
  res.redirect('/home');
};

exports.getSettings = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  const user = await User.findById(req.session.userId);
  const userImage = user && user.image ? user.image : 'user-icon.png';
  res.render('home/settings', { userImage });
};

exports.postSettings = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  if (!req.file) {
    return res.redirect('/home/settings');
  }
  try {
    const user = await User.findById(req.session.userId);
    if (user.image) {
      const oldImagePath = path.join(__dirname, '..', 'public', 'uploads', user.image);
      fs.unlink(oldImagePath, (err) => {});
    }
    user.image = req.file.filename;
    await user.save();
    req.session.userImage = user.image;
    res.redirect('/home/settings');
  } catch (err) {
    res.redirect('/home/settings');
  }
};

exports.getPostComment = async (req, res) => {
  const postId = req.params.postId;
  let userImage = 'user-icon.png';

  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user && user.image) userImage = user.image;
  }

  const post = await Post.findById(postId);
  const comments = await Comment.find({ post: postId }).populate('user').sort({ createdAt: -1 });

  res.render('home/postcomment', { post, comments, userImage });
};

exports.postPostComment = async (req, res) => {
  const { comment, postId } = req.body;
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  const newComment = new Comment({
    comment,
    user: req.session.userId,
    post: postId
  });
  await newComment.save();
  res.redirect(`/home/postcomment/${postId}`);
};
