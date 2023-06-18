const slugify = require('slugify')
const { Snowflake } = require('@theinternetfolks/snowflake')
const communityModel = require('../models/communityModel')
const authModel = require('../models/authModel')
const memberModel = require('../models/memberModel')
const createCommunity = async (req, res) => {
  const name = req.body.name
  const currrentUser = req.user
  const email = currrentUser.email
  const user = await authModel.findOne({ email })
  const slug = slugify(name, {
    lower: true, // Convert the slug to lowercase
    strict: true, // Replace special characters with their closest equivalents
  })
  // res.json({ owner: user })
  const data = {
    id: Snowflake.generate(),
    name: name,
    owner: user.id,
    slug: slug,
  }
  const doc = new communityModel(data)
  // res.json({ data: data, doc: doc })
  await doc.save()
  if (doc) {
    res.status(200).json({ status: true, content: { data: doc } })
  } else {
    throw new Error('try again')
  }
}
const ITEMS_PER_PAGE = 10
const getCommunity = async (req, res) => {
  const docs = await communityModel.find({})
  const total = docs.length
  const page = parseInt(req.query.page) || 1
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  let pages = Math.ceil(total / ITEMS_PER_PAGE)

  const paginatedItems = docs.slice(startIndex, endIndex)

  const owners = await authModel.find({})
  // console.log(owners)

  const expandedCommunities = paginatedItems.map((community) => {
    console.log(community)
    const owner = owners.filter((user) => {
      console.log(user.id)
      console.log(community.owner)
      return user.id == community.owner
      // return user._id ===
    })
    // console.log('hello')
    // console.log(owner)
    const { id, name } = owner[0]
    const new11 = community._doc
    return { ...new11, owner: { id, name } }
  })
  // res.send(new1)

  console.log(expandedCommunities)

  res.status(200).json({
    status: true,
    content: {
      data: expandedCommunities,
    },
    meta: {
      total: total,
      pages: pages,
      page: page,
    },
  })
}
const currCommunity = async (req, res) => {
  const user = req.user
  console.log(user)
  const docs = await communityModel.find({})
  const email = user.email
  const user1 = await authModel.findOne({ email })
  const total = docs.length
  const page = parseInt(req.query.page) || 1
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  let pages = Math.ceil(total / ITEMS_PER_PAGE)

  const paginatedItems = docs.slice(startIndex, endIndex)
  const expandedCommunities = paginatedItems.filter((community) => {
    // console.log(community)
    return user1.id == community.owner
    // return user._id ===

    // console.log('hello')
    // console.log(owner)
    // const { _id, name } = owner[0]
    // const new11 = community._doc
    // return { ...new11, owner: { _id, name } }
  })

  console.log(expandedCommunities)
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: total,
        pages: pages,
        page: page,
      },
      data: expandedCommunities,
    },
  })
}
const ownCommunity = async (req, res) => {
  const user = req.user
  const email = user.email
  const user1 = await authModel.findOne({ email })
  const docs = await communityModel.find({})
  const community = docs.filter((comm) => {
    const commId = comm.owner.toString()
    const userId = user.id.toString()
    return commId == userId
  })
  console.log(community)
  const total = docs.length
  const page = parseInt(req.query.page) || 1
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  let pages = Math.ceil(total / ITEMS_PER_PAGE)

  const paginatedItems = docs.slice(startIndex, endIndex)
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: total,
        pages: pages,
        page: page,
      },
      data: expandedCommunities,
    },
  })
}
const joinedCommunity = async (req, res) => {
  const user = req.user
  const email = user.email
  const user1 = await authModel.findOne({ email })
  const member = await memberModel.find({ user: user1.id.toString() })
  // console.log(member
  let comm = []

  member.map((mem) => {
    comm.push(mem.community)
  })
  // console.log(comm)
  let communities = await communityModel.find({ id: { $in: comm } })

  console.log(communities)
  const total = communities.length
  const page = parseInt(req.query.page) || 1
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  let pages = Math.ceil(total / ITEMS_PER_PAGE)

  const paginatedItems = communities.slice(startIndex, endIndex)
  // console.log(communities)
  // console.log(paginatedItems)
  const owners = await authModel.find({})
  // console.log('owners', owners)

  const expandedCommunities = paginatedItems.map((community) => {
    // console.log(community)
    const owner = owners.filter((user) => {
      console.log(user.id)
      console.log(community.owner)

      return user.id.toString() == community.owner.toString()
      // return user._id ===
    })
    // console.log('hello')
    console.log(owner)
    const { id, name } = owner[0]
    let new1 = community._doc
    return { ...new1, owner: { id, name } }
  })
  // console.log(expandedCommunities)
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: total,
        pages: pages,
        page: page,
      },
      data: expandedCommunities,
    },
  })

  // console.log('hello', ans)
}
module.exports = {
  createCommunity,
  getCommunity,
  currCommunity,
  ownCommunity,
  joinedCommunity,
}
