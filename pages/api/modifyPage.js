import clientPromise from '../../lib/mongodb'
import { encrypt } from '../../lib/crypto'
const bcrypt = require('bcrypt')
export default async function handler(req, res) {
  const client = await clientPromise
  const { pageName, password, text } = req.body
  if (!pageName || !password) {
    return res.status(400).json({ error: 'Invalid value' })
  }
  try {
    const oldPage = await client.db().collection('pages').findOne({ pageName })
    if (oldPage && bcrypt.compareSync(password, oldPage.password)) {
      const newText = encrypt(text, password)
      await client
        .db()
        .collection('pages')
        .updateOne({ pageName }, { $set: { text: newText } })
      return res.status(200).json({ success: true, status: 'Page modified' })
    }
    res.status(400).json({ error: 'authentication failed' })
  } catch (e) {
    res.status(500).json({ error: true })
  }
}
