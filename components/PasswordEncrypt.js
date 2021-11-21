import Modal from './modal'
import style from './modal.module.css'
import { useEffect, useRef, useState } from 'react'
export default function PasswordEncrypt({
  handlePasswordEncrypt,
  setOpenPasswordEncrypt,
  changePassword,
}) {
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const timeout = useRef()
  useEffect(() => {
    return () => {
      clearTimeout(timeout.current)
    }
  }, [])

  function handleSubmit() {
    if (password1 === password2) {
      handlePasswordEncrypt(password1)
    } else {
      setError("Passwords don't match.")
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        setError('')
      }, 1500)
    }
  }
  return (
    <Modal>
      <div className={style.title}>
        {changePassword ? 'Change password' : 'Create Password'}
      </div>
      <div className={style.desc}>
        {changePassword
          ? `Enter new password and click Save.
              Make sure to remember the password. We don't store passwords, just the encrypted data. (If the password is forgotten, the data can't be accessed.)
              Longer passwords are more secure.`
          : `Make sure to remember the password. We don't store passwords, just the
              encrypted data. (If the password is forgotten, the data can't be
              accessed.) Longer passwords are more secure.`}
      </div>
      <form
        className={style.passwordForm}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        {error !== '' && <div className={style.error}>{error}</div>}
        <div>
          <label htmlFor="password1">Password</label>
          <input
            type="password"
            value={password1}
            id="password1"
            onChange={(e) => setPassword1(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="password2">Repeat Password</label>
          <input
            type="password"
            value={password2}
            id="password2"
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <div className={style.buttonsContainer}>
          <button
            onClick={() => setOpenPasswordEncrypt(false)}
            className={style.redbtn}
          >
            Cancel
          </button>
          <button type="submit" className={style.greenbtn}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
