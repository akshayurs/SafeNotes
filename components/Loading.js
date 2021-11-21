import Modal from './Modal'
import style from './modal.module.css'
export default function Loading() {
  return (
    <Modal>
      <svg className={style.spinner} viewBox="0 0 50 50">
        <circle
          className={style.path}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        ></circle>
      </svg>
    </Modal>
  )
}
