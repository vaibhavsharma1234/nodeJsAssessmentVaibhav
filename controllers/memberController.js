const authModel = require('../models/authModel')
const memberModel = require('../models/memberModel')
const communityModel = require('../models/communityModel')
const roleModel = require('../models/roleModel')
const { Snowflake } = require('@theinternetfolks/snowflake')
const createMember = async (req, res) => {
  const user = req.user
  const email = user.email
  const admin = await authModel.findOne({ email })
  const communityId = req.body.community
  const id = communityId
  const communityObj = await communityModel.findOne({ id })
  console.log(admin, communityObj)
  let adminId, ownerId
  adminId = admin.id
  ownerId = communityObj.owner.toString()
  console.log(adminId, ownerId)
  if (adminId === ownerId) {
    const data = {
      id: Snowflake.generate(),
      community: communityId,
      user: req.body.user,
      role: req.body.role,
    }
    const doc = new memberModel(data)
    await doc.save()
    if (doc) {
      res.status(200).json({ status: true, content: { data: doc } })
    } else {
      throw new Error('could not create memeber')
    }
  } else {
    throw new Error('NOT_ALLOWED_ACCESS')
  }
}
const deleteMember = async (req, res) => {
  const user1 = req.user
  const email = user1.email
  const admin = await authModel.findOne({ email })
  const user = req.params.id.toString()

  console.log(user)
  const member = await memberModel.findOne({})
  console.log(member)

  const communityId = member.community
  const id = communityId
  const community = await communityModel.findOne({ id })
  console.log(community)
  let adminId, ownerId
  adminId = admin.id
  ownerId = community.owner.toString()
  if (adminId === ownerId) {
    let res1 = await memberModel.deleteOne({ user })
    if (res1) {
      res.status(200).json({ status: true })
    }
  } else {
    throw new Error('NOT_ALLOWED_ACCESS')
  }
}
const ITEMS_PER_PAGE = 10
const getMembers = async (req, res) => {
  const community = await communityModel.findOne({ slug: req.params.id })
  //   console.log(community)
  const communityId = community.id
  const member = await memberModel.find({ community: communityId })
  console.log(member)
  const total = member.length
  const page = parseInt(req.query.page) || 1
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  let pages = Math.ceil(total / ITEMS_PER_PAGE)
  const users = await authModel.find({})
  const roles = await roleModel.find({})
  const paginatedItems = member.slice(startIndex, endIndex)
  const expandedCommunities = paginatedItems.map((member) => {
    // console.log(member)

    const user = users.filter((user) => {
      //   console.log(user._id)
      const userId = user.id
      //   console.log(member.user)
      return user.id == member.user
      // return user._id ===
    })
    // console.log(user)
    // console.log('hello')
    // console.log(owner)
    const { id, name } = user[0]
    const new11 = member._doc
    return { ...new11, user: { id, name } }
  })
  //   console.log(expandedCommunities)
  const expandedCommunities1 = expandedCommunities.map((member) => {
    console.log('member', member)

    const role1 = roles.filter((role) => {
      //   console.log(user._id)
      const roleid = role.id.toString()
      //   console.log(member.user)
      return roleid == member.role
      // return user._id ===
    })
    console.log(role1)
    // console.log('hello')
    // console.log(owner)
    const { id, name } = role1[0]
    const new11 = member
    return { ...new11, role: { id, name } }
  })
  //   console.log(expandedCommunities1)
  res.status(200).json({
    status: true,
    content: {
      data: expandedCommunities1,
    },
    meta: {
      total: total,
      pages: pages,
      page: page,
    },
  })
}
//  "community": "7075909458492656301",
//      "role":"7075866195570746946",
//      "user":"648deb6c088f3b913bf5b117"
module.exports = { createMember, deleteMember, getMembers }
