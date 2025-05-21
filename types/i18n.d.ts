import 'i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    compatibilityJSON: 'v3';
    resources: {
      translation: typeof en & typeof es;
    };
  }
}