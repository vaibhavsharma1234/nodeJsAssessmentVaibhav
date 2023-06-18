const express = require('express')
const router = require('express').Router()
const { createRole, getRole } = require('../controllers/roleController')
const { signup, signin, currUser } = require('../controllers/authController')
const {
  createCommunity,
  getCommunity,
  currCommunity,
  ownCommunity,
  joinedCommunity,
} = require('../controllers/communityController')
const {
  createMember,
  deleteMember,
  getMembers,
} = require('../controllers/memberController')
const authenticateToken = require('../middlewares/authUser')
router.post('/role', createRole)
router.get('/role', getRole)
router.post('/auth/signup', signup)
router.post('/auth/signin', signin)
router.post('/auth/me', authenticateToken, currUser)
router.post('/community', authenticateToken, createCommunity)
router.get('/community', getCommunity)
router.get('/community/me/owner', authenticateToken, currCommunity)
router.post('/member', authenticateToken, createMember)
router.delete('/member/:id', authenticateToken, deleteMember)
router.get('/community/:id/members', getMembers)
router.get('/community/me/owner', authenticateToken, ownCommunity)
router.get('/community/me/member', authenticateToken, joinedCommunity)
module.exports = router
