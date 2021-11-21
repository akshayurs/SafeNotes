import clientPromise from '../../lib/mongodb'
import { decrypt } from '../../lib/crypto'
const bcrypt = require('bcrypt')
export default async function handler(req, res) {
  const client = await clientPromise
  const { checkExist } = req.query
  let { pageName, password } = req.body
  if (checkExist) {
    pageName = checkExist
  }
  if (!pageName) {
    return res.status(400).json({ error: 'invalid pageName' })
  }
  try {
    const page = await client.db().collection('pages').findOne({ pageName })
    if (page) {
      if (checkExist) {
        return res.status(200).json({ found: true })
      } else {
        if (!password || !bcrypt.compareSync(password, page.password)) {
          return res.status(200).json({ error: 'Invalid Password' })
        }
        const data = decrypt(page.text, password)
        if (!data.success) {
          return res.status(200).json({ error: 'Invalid Password' })
        }
        res.status(200).json({
          page: {
            pageName: page.pageName,
            text: data.data,
            createdDate: page.createdDate,
          },
        })
      }
    } else {
      if (checkExist) {
        return res.status(200).json({ found: false })
      }
      res.status(404).json({ found: false })
    }
  } catch (e) {
    res.status(500).json({ error: 'server error' })
  }
}
