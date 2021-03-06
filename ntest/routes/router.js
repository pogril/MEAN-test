const router = require('express').Router();
const path = require('path');

const authController = require(path.join(__dirname, '..', 'controllers', 'authController')).authorize;
const userController = require(path.join(__dirname, '..', 'controllers', 'userController.js'));
const channelController = require(path.join(__dirname, '..', 'controllers', 'channelController.js'));
const tickController = require(path.join(__dirname, '..', 'controllers', 'tickController.js'));
const uploadController = require(path.join(__dirname, '../', 'controllers', 'uploadController.js'));


router.post('/login', userController.logIn);
router.post('/signup', uploadController.imageUploader, userController.signUp);

router.get('/checkemail/:email', userController.checkEmail);
router.get('/checkusername/:name', userController.checkUsername);

router.post('/createnewchannel', authController, channelController.createNewChannel);
router.get('/channels/listen/:id', authController, channelController.listen);

router.get('/channels/:id', authController, channelController.getMessages);
router.post('/channels/:id', authController, channelController.postMessage);

router.get('/loadmore/:id', authController, channelController.loadMore);

module.exports = router;