/** Concatène des classes conditionnelles (mini clsx) */
export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')
