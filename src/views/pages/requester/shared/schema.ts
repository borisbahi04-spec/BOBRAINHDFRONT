import * as yup from 'yup'
import { PriorityEnum } from 'src/definitions/enum'

export const TICKET_ITEM = /^[A-Z]{2}-\d{4,12}$/
export const DESCRIPTION_MIN = 10
export const CORRECTION_MIN = 5
export const TEXT_MAX = 5000

const optionShape = yup.object({ id: yup.string().required(), label: yup.string() }).nullable()

/** "ay-0001 ,az-1234" -> ["AY-0001", "AZ-1234"] */
export const splitTickets = (value?: string) =>
  String(value ?? '')
    .split(',')
    .map(t => t.trim().toUpperCase())
    .filter(Boolean)

export const normalizeTickets = (value?: string) => splitTickets(value).join(', ')

export type Translate = (key: string, options?: any) => string

export const buildRequesterSchema = (t: Translate) =>
  yup.object({
    ticket: yup
      .string()
      .trim()
      .required(t('form.errors.ticketRequired'))
      .test('format', t('form.errors.ticketFormat'), v => {
        const items = splitTickets(v)
        return items.length > 0 && items.every(i => TICKET_ITEM.test(i))
      })
      .test('duplicate', function (v) {
        const items = splitTickets(v)
        const dup = items.find((x, i) => items.indexOf(x) !== i)
        return dup ? this.createError({ message: t('form.errors.ticketDuplicate', { ticket: dup }) }) : true
      }),
    priority: yup
      .mixed<PriorityEnum>()
      .oneOf(Object.values(PriorityEnum))
      .required(t('form.errors.priorityRequired')),
    station: optionShape.required(t('form.errors.stationRequired')),
    requesttype: optionShape.required(t('form.errors.requestTypeRequired')),
    // facultatifs
    labAgent: optionShape.optional(),
    operator: optionShape.optional(),
    description: yup
      .string()
      .trim()
      .required(t('form.errors.descriptionRequired'))
      .min(DESCRIPTION_MIN, t('form.errors.min', { min: DESCRIPTION_MIN }))
      .max(TEXT_MAX, t('form.errors.max', { max: TEXT_MAX })),
    correction: yup
      .string()
      .trim()
      .required(t('form.errors.correctionRequired'))
      .min(CORRECTION_MIN, t('form.errors.min', { min: CORRECTION_MIN }))
      .max(TEXT_MAX, t('form.errors.max', { max: TEXT_MAX }))
  })
