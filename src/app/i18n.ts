import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      app: {
        title: 'Web Mishnah',
        subtitle: 'Learn Mishnah Berakhot',
        startLesson: 'Start lesson',
        read: 'Read',
        practice: 'Practice',
        recall: 'Recall',
        complete: 'Lesson complete!',
        xp: 'XP',
        streak: 'Day streak',
        transliteration: 'Transliteration',
        credits: 'Credits & Sources',
      },
    },
    he: {
      app: {
        title: 'משנה באינטרנט',
        subtitle: 'לימוד משנה ברכות',
        startLesson: 'התחל שיעור',
        read: 'קריאה',
        practice: 'תרגול',
        recall: 'חזרה',
        complete: 'השיעור הושלם!',
        xp: 'נקודות',
        streak: 'רצף ימים',
        transliteration: 'תעתיק',
        credits: 'קרדיטים ומקורות',
      },
    },
  },
})
