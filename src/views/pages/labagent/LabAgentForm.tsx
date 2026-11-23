import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { Button, Field, Modal, cn } from 'src/components/hd'
import { createLabAgentService, LabAgentDto, updateLabAgentService } from 'src/myservices/labagent/labagent-service'

interface Props {
  open: boolean
  agent?: any | null
  onClose: () => void
  onSaved: () => void
}

const LabAgentForm = ({ open, agent, onClose, onSaved }: Props) => {
  const { t, lang } = useHd()
  const [saving, setSaving] = useState(false)
  const isEdit = !!agent?.id

  const schema = useMemo(
    () =>
      yup.object({
        matricule: yup
          .string()
          .trim()
          .required(t('labAgent.errors.matriculeRequired'))
          .min(2, t('form.errors.min', { min: 2 }))
          .max(30, t('form.errors.max', { max: 30 }))
          .matches(/^[A-Za-z0-9._-]+$/, t('labAgent.errors.matriculeFormat')),
        lastName: yup
          .string()
          .trim()
          .required(t('labAgent.errors.lastNameRequired'))
          .min(2, t('form.errors.min', { min: 2 }))
          .max(80, t('form.errors.max', { max: 80 })),
        firstName: yup.string().trim().max(120, t('form.errors.max', { max: 120 })),
        phoneNumber: yup
          .string()
          .trim()
          .max(30)
          .test('phone', t('labAgent.errors.phoneFormat'), v => !v || /^\+?[0-9 ().-]{6,30}$/.test(v)),
        isActive: yup.boolean()
      }),
    [t, lang] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LabAgentDto>({ resolver: yupResolver(schema), mode: 'onTouched' })

  useEffect(() => {
    if (open)
      reset({
        matricule: agent?.matricule ?? '',
        lastName: agent?.lastName ?? '',
        firstName: agent?.firstName ?? '',
        phoneNumber: agent?.phoneNumber ?? '',
        isActive: agent?.isActive ?? true
      })
  }, [open, agent, reset])

  const onSubmit = async (values: LabAgentDto) => {
    setSaving(true)
    const payload: LabAgentDto = {
      matricule: values.matricule.trim().toUpperCase(),
      lastName: values.lastName.trim(),
      firstName: values.firstName?.trim() || undefined,
      phoneNumber: values.phoneNumber?.trim() || undefined,
      isActive: values.isActive
    }
    const res: any = isEdit ? await updateLabAgentService(agent.id, payload) : await createLabAgentService(payload)
    setSaving(false)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('labAgent.saved'))
    onSaved()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t('labAgent.editTitle') : t('labAgent.newTitle')}
      footer={
        <>
          <Button variant='secondary' onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button icon='mdi:content-save-outline' loading={saving} onClick={handleSubmit(onSubmit)}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className='grid gap-x-4 gap-y-1 sm:grid-cols-2'>
        <Field id='la-matricule' label={t('labAgent.matricule')} required error={errors.matricule?.message}>
          <input id='la-matricule' className={cn('hd-input font-mono uppercase placeholder:normal-case', errors.matricule && 'hd-input-error')} {...register('matricule')} />
        </Field>
        <Field id='la-phone' label={t('labAgent.phone')} error={errors.phoneNumber?.message}>
          <input id='la-phone' type='tel' className={cn('hd-input', errors.phoneNumber && 'hd-input-error')} {...register('phoneNumber')} />
        </Field>
        <Field id='la-last' label={t('labAgent.lastName')} required error={errors.lastName?.message}>
          <input id='la-last' className={cn('hd-input uppercase', errors.lastName && 'hd-input-error')} {...register('lastName')} />
        </Field>
        <Field id='la-first' label={t('labAgent.firstName')} error={errors.firstName?.message}>
          <input id='la-first' className={cn('hd-input', errors.firstName && 'hd-input-error')} {...register('firstName')} />
        </Field>
        <label className='flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700 sm:col-span-2'>
          <input type='checkbox' className='h-4 w-4 accent-brand-600' {...register('isActive')} />
          {t('common.active')}
        </label>
        <button type='submit' className='hidden' />
      </form>
    </Modal>
  )
}

export default LabAgentForm
