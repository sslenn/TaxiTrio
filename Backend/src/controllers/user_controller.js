const userService = require('../services/user_service');
const { successResponse } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
  try {
    const data = await userService.getAllUsers();
    res.json(successResponse('Users fetched', data));
  } catch (e) { next(e); }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await userService.updateProfile(req.user.id, req.body);
    res.json(successResponse('Profile updated', data));
  } catch (e) { next(e); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const data = await userService.toggleUserStatus(req.params.id);
    res.json(successResponse('User status updated', data));
  } catch (e) { next(e); }
};

const getAllDrivers = async (req, res, next) => {
  try {
    const data = await userService.getAllDrivers();
    res.json(successResponse('Drivers fetched', data));
  } catch (e) { next(e); }
};

const createDriverShell = async (req, res, next) => {
  try {
    const data = await userService.createDriverShell(req.body);
    res.status(201).json(successResponse('Driver profile created and invitation sent', data));
  } catch (e) { next(e); }
};

const getUserDetails = async (req, res, next) => {
  try {
    const data = await userService.getUserDetails(req.params.id);
    res.json(successResponse('User details fetched', data));
  } catch (e) { next(e); }
};

module.exports = { getAllUsers, updateProfile, toggleUserStatus, getAllDrivers, createDriverShell, getUserDetails };
