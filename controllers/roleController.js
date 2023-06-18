const roleModel = require('../models/roleModel')
const { Snowflake } = require('@theinternetfolks/snowflake')
const createRole = async (req, res) => {
  const name = req.body.name
  const data = {
    id: Snowflake.generate(),
    name: name,
  }
  const doc = new roleModel(data)
  await doc.save()
  if (doc) {
    res.status(200).json({ status: true, content: { data: doc } })
  } else {
    throw new Error('could not save your ad')
  }
}
const ITEMS_PER_PAGE = 10
const getRole = async (req, res) => {
  const docs = await roleModel.find({})
  const total = docs.length
  const page = parseInt(req.query.page) || 1
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  let pages = Math.ceil(total / ITEMS_PER_PAGE)

  const paginatedItems = docs.slice(startIndex, endIndex)
  res.status(200).json({
    meta: {
      total: total,
      pages: pages,
      page: page,
    },
    data: paginatedItems,
  })
}

module.exports = { createRole, getRole }
