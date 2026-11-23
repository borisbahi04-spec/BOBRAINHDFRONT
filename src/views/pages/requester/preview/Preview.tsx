// Détail d'une demande + actions de workflow
import { useContext, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import { AppDispatch, RootState } from 'src/redux/store'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { enumStatus } from 'src/definitions/enum'
import { getByIdrequestersAction, postStatusrequesterAction } from 'src/redux/actions/requester/requester-actions'
import { useHd } from 'src/i18n/helpdesk'
import HttpService from 'src/myservices/HttpService'
import { extractApiError } from 'src/helpers/apiError'
import { Button, ConfirmDialog, EmptyState, PageHeader } from 'src/components/hd'
import PreviewCard from './PreviewCard'
import { requesterListHref } from '../shared/listReturn'

/** Transitions autorisées — identiques au backend (REQUESTER_TRANSITIONS) */
const TRANSITIONS: Record<string, enumStatus[]> = {
  [enumStatus.Open]: [enumStatus.Approved, enumStatus.Rejected, enumStatus.Cancelled],
  [enumStatus.Approved]: [enumStatus.Treated, enumStatus.Cancelled],
  [enumStatus.Treated]: [enumStatus.Closed]
}

const ACTION_UI: Record<string, { label: string; icon: string; variant: 'primary' | 'secondary' | 'danger' | 'accent'; perm: UserAction }> = {
  [enumStatus.Approved]: { label: 'preview.approve', icon: 'mdi:check-circle-outline', variant: 'primary', perm: UserAction.Approval },
  [enumStatus.Treated]: { label: 'preview.treat', icon: 'mdi:wrench-check-outline', variant: 'accent', perm: UserAction.Treated },
  [enumStatus.Closed]: { label: 'preview.closeReq', icon: 'mdi:lock-check-outline', variant: 'primary', perm: UserAction.Close },
  [enumStatus.Rejected]: { label: 'preview.reject', icon: 'mdi:close-circle-outline', variant: 'danger', perm: UserAction.Approval },
  [enumStatus.Cancelled]: { label: 'preview.cancelReq', icon: 'mdi:cancel', variant: 'secondary', perm: UserAction.Cancel }
}

const RequesterPreview = (_props: any) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)
  const { t, lang } = useHd()
  const printref = useRef<HTMLDivElement>(null)
  const data = useSelector((state: RootState) => state.requester.previewdata)
  const [pending, setPending] = useState<enumStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const [pdfBusy, setPdfBusy] = useState<'print' | 'download' | null>(null)

  /** PDF généré par l'API (GET /requester/:id/pdf), ouvert pour impression ou téléchargé */
  const openPdf = async (mode: 'print' | 'download') => {
    // fenêtre ouverte tout de suite (sinon bloquée par le navigateur après l'appel asynchrone)
    const win = mode === 'print' ? window.open('', '_blank') : null
    setPdfBusy(mode)
    try {
      const buffer = await new HttpService().getDataAsBuffer(`requester/${data.id}/pdf?lang=${lang}`)
      const url = URL.createObjectURL(new Blob([buffer], { type: 'application/pdf' }))
      if (mode === 'print' && win) {
        win.location.href = url
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = `DEMANDE-${data.reference}.pdf`
        a.click()
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch {
      win?.close()
      toast.error(t('preview.pdfError'))
    } finally {
      setPdfBusy(null)
    }
  }

  if (!data || !data.id) {
    return <EmptyState icon='mdi:file-question-outline' title={t('list.emptyTitle')} />
  }

  const actions = (TRANSITIONS[data.status] ?? []).filter(s => ability.can(ACTION_UI[s].perm, EntityAbility.REQUESTER))
  const canEdit = data.status === enumStatus.Open && ability.can(UserAction.Edit, EntityAbility.REQUESTER)

  const confirmStatus = () => {
    if (!pending) return
    setLoading(true)
    dispatch(
      postStatusrequesterAction(
        data.id,
        pending,
        () => {
          setLoading(false)
          toast.success(t('preview.statusUpdated', { status: t(`status.${pending}`) }))
          setPending(null)
          dispatch(getByIdrequestersAction(data.id))
        },
        (res: any) => {
          setLoading(false)
          setPending(null)
          toast.error(extractApiError(res, t('common.unexpectedError')))
        }
      )
    )
  }

  return (
    <div className='w-full font-sans'>
      <PageHeader
        icon='mdi:file-document-outline'
        title={t('preview.title', { ref: data.reference })}
        actions={
          <Button variant='secondary' icon='mdi:arrow-left' onClick={() => router.push(requesterListHref())}>
            {t('common.back')}
          </Button>
        }
      />

      <div className='grid items-start gap-5 xl:grid-cols-[1fr_280px]'>
        <PreviewCard printref={printref} />

        <aside className='hd-card sticky top-4 space-y-3 p-4'>
          <Button className='w-full' icon='mdi:printer-outline' loading={pdfBusy === 'print'} onClick={() => openPdf('print')}>
            {pdfBusy === 'print' ? t('preview.generating') : t('common.print')}
          </Button>
          <Button className='w-full' variant='secondary' icon='mdi:file-download-outline' loading={pdfBusy === 'download'} onClick={() => openPdf('download')}>
            {t('preview.download')}
          </Button>
          {canEdit && (
            <Button className='w-full' variant='secondary' icon='mdi:pencil-outline' onClick={() => router.push(`/requester/edit/${data.id}`)}>
              {t('common.edit')}
            </Button>
          )}

          {actions.length > 0 && (
            <>
              <p className='m-0 border-0 border-t border-solid border-gray-100 pt-3 text-[11px] font-bold uppercase tracking-wide text-gray-500'>
                {t('preview.actions')}
              </p>
              {actions.map(s => (
                <Button key={s} className='w-full' variant={ACTION_UI[s].variant} icon={ACTION_UI[s].icon} onClick={() => setPending(s)}>
                  {t(ACTION_UI[s].label)}
                </Button>
              ))}
            </>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={!!pending}
        loading={loading}
        danger={pending === enumStatus.Rejected || pending === enumStatus.Cancelled}
        title={pending ? t(ACTION_UI[pending].label) : ''}
        message={pending ? t('preview.confirmStatus', { status: t(`status.${pending}`) }) : ''}
        onCancel={() => setPending(null)}
        onConfirm={confirmStatus}
      />
    </div>
  )
}

export default RequesterPreview
