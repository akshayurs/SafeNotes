import clientPromise from '../../lib/mongodb'
const bcrypt = require('bcrypt')
export default async function handler(req, res) {
  const client = await clientPromise
  const { pageName, password } = req.body
  if (!pageName || !password) {
    return res.status(400).json({ error: 'Invalid value' })
  }
  try {
    const oldPage = await client.db().collection('pages').findOne({ pageName })
    if (oldPage && bcrypt.compare(password, oldPage.password)) {
      await client
        .db()
        .collection('deletedPages')
        .insertOne({ oldPage, deletedDate: Date.now() })

      await client.db().collection('pages').deleteOne({ pageName })
      return res.status(200).json({ success: true, status: 'Page Deleted' })
    }
    res.status(400).json({ error: 'authentication failed' })
  } catch (e) {
    res.status(500).json({ error: true })
  }
}
