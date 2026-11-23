import { useHd, HdLang } from 'src/i18n/helpdesk'
import { cn } from './cn'

/** Bascule FR / EN */
const LangSwitch = () => {
  const { lang, setLang, t } = useHd()
  return (
    <div role='group' aria-label={t('common.language')} className='inline-flex rounded-lg border border-solid border-gray-200 bg-white p-0.5'>
      {(['fr', 'en'] as HdLang[]).map(l => (
        <button
          key={l}
          type='button'
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            'cursor-pointer rounded-md border-0 px-2.5 py-1 text-xs font-bold uppercase transition',
            lang === l ? 'bg-brand-600 text-white' : 'bg-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default LangSwitch
