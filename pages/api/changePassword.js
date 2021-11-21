import clientPromise from '../../lib/mongodb'
import { encrypt, decrypt } from '../../lib/crypto'
const bcrypt = require('bcrypt')
export default async function handler(req, res) {
  const client = await clientPromise
  const { pageName, oldPassword, newPassword, text } = req.body
  if (!pageName || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Invalid value' })
  }
  try {
    const oldPage = await client.db().collection('pages').findOne({ pageName })
    if (oldPage && bcrypt.compareSync(oldPassword, oldPage.password)) {
      const newHash = bcrypt.hashSync(newPassword, 10)
      const newText = encrypt(text, newPassword)
      await client
        .db()
        .collection('pages')
        .updateOne({ pageName }, { $set: { password: newHash, text: newText } })
      return res.status(200).json({ success: true, status: 'Password changed' })
    }
    res.status(400).json({ error: 'authentication failed' })
  } catch (e) {
    res.status(500).json({ error: true })
  }
}
