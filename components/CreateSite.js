import Modal from './modal'
import style from './modal.module.css'
import Link from 'next/link'
export default function CreateSite({ sitename, setOpenCreate }) {
  return (
    <Modal>
      <div className={style.title}>Create new site?</div>
      <div className={style.desc}>
        Great! This site doesn&apos;t exist, it can be yours! Would you like to
        create: <br /> <div className={style.sitename}>{sitename}</div>
      </div>
      <div className={style.buttonsContainer}>
        <button className={style.redbtn}>
          <Link href="/">Cancel</Link>
        </button>
        <button
          onClick={() => {
            setOpenCreate(false)
          }}
          autoFocus
          className={style.greenbtn}
        >
          Create
        </button>
      </div>
    </Modal>
  )
}
