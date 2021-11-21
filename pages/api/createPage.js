import clientPromise from '../../lib/mongodb'
import { encrypt } from '../../lib/crypto'
const bcrypt = require('bcrypt')
export default async function handler(req, res) {
  const client = await clientPromise
  const { pageName, text, password } = req.body
  if (!pageName || !text || !password) {
    return res.status(400).json({ error: 'Invalid value' })
  }
  try {
    const oldPage = await client.db().collection('pages').findOne({ pageName })
    if (oldPage) {
      return res.status(400).json({ error: 'Page already exist' })
    }
    const hash = bcrypt.hashSync(password, 10)
    const encryptedData = encrypt(text, password)
    const newPage = await client
      .db()
      .collection('pages')
      .insertOne({
        pageName,
        text: encryptedData,
        password: hash,
        createdDate: Date.now(),
      })
    res.status(200).json({ id: newPage.insertedId })
  } catch (e) {
    res.status(500).json({ error: true })
  }
}
