import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CreateSite from '../components/CreateSite'
import PasswordDecrypt from '../components/PasswordDecrypt'
import PasswordEncrypt from '../components/PasswordEncrypt'
import fetchData from '../lib/fetchData'
import style from './sitename.module.css'
import Link from 'next/link'
export default function Site() {
  const [openCreate, setOpenCreate] = useState(false)
  const [openPasswordDecrypt, setOpenPasswordDecrypt] = useState(false)
  const [openPasswordEncrypt, setOpenPasswordEncrypt] = useState(false)
  const [openChangePassword, setOpenChangePassword] = useState(false)
  const [popupText, setPopupText] = useState('')
  const [decryptError, setDecryptError] = useState('')
  const createSite = useRef(false)
  const sitePassword = useRef('')
  const [siteText, setSiteText] = useState('')
  const siteOldText = useRef('')
  const router = useRouter()
  const { sitename } = router.query
  const siteaddress = useRef('')
  const popupTimeout = useRef()
  const errorTimeout = useRef()
  useEffect(() => {
    siteaddress.current = window.location.href
    ;(async function () {
      const isPageExist = await fetchData(
        `/api/getPage/?checkExist=${sitename}`
      )
      setOpenCreate(!isPageExist.found)
      createSite.current = !isPageExist.found
      setOpenPasswordDecrypt(isPageExist.found)
    })()
    return () => {
      clearTimeout(popupTimeout.current)
      clearTimeout(errorTimeout.current)
    }
  }, [sitename, popupTimeout, errorTimeout])
  function handlePopupText(text) {
    setPopupText('')
    clearTimeout(popupTimeout.current)
    setPopupText(text)
    popupTimeout.current = setTimeout(() => {
      setPopupText('')
    }, 1000)
  }
  async function handlePasswordDecrypt(password) {
    const data = await fetchData('/api/getPage/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageName: sitename,
        password,
      }),
    })
    sitePassword.current = password
    if (!data.error) {
      setOpenPasswordDecrypt(false)
      siteOldText.current = data.page.text
      setSiteText(data.page.text)
      handlePopupText('Loaded')
    } else {
      setDecryptError(data.error)
      clearTimeout(errorTimeout.current)
      errorTimeout.current = setTimeout(() => {
        setDecryptError('')
      }, 1500)
    }
  }
  function handlePasswordEncrypt(password) {
    sitePassword.current = password
    setOpenPasswordEncrypt(false)
    handleSave()
  }

  async function handleSave() {
    const URL = createSite.current ? '/api/createPage/' : '/api/modifyPage/'
    if (sitePassword.current == '') {
      setOpenPasswordEncrypt(true)
    } else {
      const data = await fetchData(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageName: sitename,
          password: sitePassword.current,
          text: siteText,
        }),
      })
      handlePopupText('Saved')
      siteOldText.current = siteText
    }
  }
  async function handleDelete() {
    const data = await fetchData('/api/deletePage/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageName: sitename,
        password: sitePassword.current,
      }),
    })
    if (!data.error) {
      handlePopupText('Deleted')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  }
  async function handleChangePassword(password) {
    const data = await fetchData('/api/changePassword/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageName: sitename,
        oldPassword: sitePassword.current,
        newPassword: password,
        text: siteText,
      }),
    })
    setOpenChangePassword(false)
    handlePopupText('Password Changed')
  }
  return (
    <>
      <div className={style.site}>
        <div className={style.navbar}>
          <div className={style.logo}>
            <Link href="/">Safe Notes</Link>
          </div>
          <div className={style.buttons}>
            <button>
              <a href={`whatsapp://send?text=${siteaddress.current}`}>Share</a>
            </button>
            <button
              onClick={handleSave}
              disabled={siteOldText.current === siteText}
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              disabled={sitePassword.current === ''}
            >
              Delete
            </button>
            <button
              onClick={() => setOpenChangePassword(true)}
              disabled={sitePassword.current === ''}
            >
              Change Password
            </button>
          </div>
        </div>
        <textarea
          placeholder="Your text goes here..."
          onChange={(e) => setSiteText(e.target.value)}
          required
          value={siteText}
        />

        {openCreate && (
          <CreateSite sitename={sitename} setOpenCreate={setOpenCreate} />
        )}
        {openPasswordDecrypt && (
          <PasswordDecrypt
            handlePasswordDecrypt={handlePasswordDecrypt}
            error={decryptError}
          />
        )}
        {openPasswordEncrypt && (
          <PasswordEncrypt
            handlePasswordEncrypt={handlePasswordEncrypt}
            setOpenPasswordEncrypt={setOpenPasswordEncrypt}
          />
        )}
        {openChangePassword && (
          <PasswordEncrypt
            handlePasswordEncrypt={handleChangePassword}
            setOpenPasswordEncrypt={setOpenChangePassword}
          />
        )}
        {popupText !== '' && <div className={style.popupText}>{popupText}</div>}
      </div>
    </>
  )
}
