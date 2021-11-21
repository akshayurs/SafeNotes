import Modal from './Modal'
import Link from 'next/link'
import style from './modal.module.css'
import { useState } from 'react'
export default function PasswordDecrypt({ handlePasswordDecrypt, error }) {
  const [password, setPassword] = useState('')

  return (
    <Modal>
      <div className={style.title}>Password required</div>
      <div className={style.desc}>
        This site (this URL) is already occupied. If this is your site enter the
        password, or you can try using <Link href="/">different site.</Link>
      </div>
      <form
        className={style.passwordForm}
        onSubmit={(e) => {
          e.preventDefault()
          handlePasswordDecrypt(password)
          setPassword('')
        }}
      >
        {error !== '' && <div className={style.error}>{error}</div>}
        <div>
          <label htmlFor="password">Password used to encrypt this site:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className={style.buttonsContainer}>
          <button className={style.redbtn}>
            <Link href="/">Cancel</Link>
          </button>
          <button type="submit" className={style.greenbtn}>
            Decrypt this site
          </button>
        </div>
      </form>
    </Modal>
  )
}
