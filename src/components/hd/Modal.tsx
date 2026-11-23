import { ReactNode, useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import { useHd } from 'src/i18n/helpdesk'
import Button from './Button'
import { cn } from './cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Modal = ({ open, onClose, title, children, footer, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className='fixed inset-0 z-[1300] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-gray-900/40' onClick={onClose} />
      <div
        role='dialog'
        aria-modal='true'
        className={cn(
          'relative w-full animate-fade-in rounded-xl bg-white shadow-pop',
          size === 'sm' && 'max-w-md',
          size === 'md' && 'max-w-xl',
          size === 'lg' && 'max-w-3xl'
        )}
      >
        <div className='flex items-center justify-between border-0 border-b border-solid border-gray-100 px-5 py-4'>
          <h2 className='m-0 text-base font-bold text-brand-700'>{title}</h2>
          <button
            type='button'
            onClick={onClose}
            className='flex cursor-pointer rounded-md border-0 bg-transparent p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700'
          >
            <Icon icon='mdi:close' fontSize={20} />
          </button>
        </div>
        <div className='px-5 py-4'>{children}</div>
        {footer && (
          <div className='flex justify-end gap-2 rounded-b-xl border-0 border-t border-solid border-gray-100 bg-gray-50 px-5 py-3'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

interface ConfirmProps {
  open: boolean
  title: ReactNode
  message: ReactNode
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({ open, title, message, confirmLabel, danger, loading, onConfirm, onCancel }: ConfirmProps) => {
  const { t } = useHd()
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size='sm'
      title={title}
      footer={
        <>
          <Button variant='secondary' onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            className={danger ? '!bg-red-600 !text-white hover:!bg-red-700' : undefined}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel ?? t('common.confirm')}
          </Button>
        </>
      }
    >
      <p className='m-0 text-sm text-gray-600'>{message}</p>
    </Modal>
  )
}
