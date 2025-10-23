export const supportedLocales = ['ko', 'en'] as const;
export type Locale = typeof supportedLocales[number];

export function isSupportedLocale(value: string | undefined): value is Locale {
  return !!value && (supportedLocales as readonly string[]).includes(value);
}

export function getDefaultLocaleFromNavigator(navigatorLang?: string): Locale {
  const base = (navigatorLang || 'ko').split('-')[0].toLowerCase();
  return isSupportedLocale(base) ? (base as Locale) : 'ko';
}


