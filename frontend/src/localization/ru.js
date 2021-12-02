export function russianPluralization(choice, choicesLength) {
  if (choice === 0) return 0;

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;
  if (!teen && endsWithOne) return 1;

  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) return 2;

  return choicesLength < 4 ? 2 : 3;
}

export default {
  common: {
    delete: 'Удалить',
    open: 'Открыть',
    create: 'Создать',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    close: 'Закрыть',
    detail: 'Подробнее',
    share: 'Поделиться',
    send: 'Отправить',
    skip: 'Пропустить',
    back: 'Назад',
    notAssigned: 'Не назначено',
    lastUpdates: 'Последние обновления',
    clearAll: 'Очистить всё',
    or: 'или',
    code: 'Код',
    help: 'Помощь',
    settings: 'Настройки',
    createIssue: 'Создать задачу',
    noResults: 'Результатов нет',
    summary: 'Резюме',
    title: 'Название',
    description: 'Описание',
    giveReview: 'Оставить отзыв',
    addTitle: 'Добавить название',
    changeTitle: 'Изменить название',
    activity: 'Активность',
    addComment: 'Добавить комментарий...',
    advice: 'Совет',
    press: 'нажмите',
    toAddComment: 'чтобы добавить комментарий',
    edited: 'Изменено',
    edit: 'Изменить',
    created: 'Создрано',
    updateDate: 'Дата обновления',
    thereNoAnything: 'Здесь ничего нет',
    search: 'Поиск',
  },

  user: {
    displayName: 'Отображаемое имя',
    username: 'Имя пользователя',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    profile: 'Профиль',
    displayNameUsernameOrEmail: 'Их отображаемое имя, имя пользователя или email',
    max10Users: 'Вы можете пригласить не более 10 пользователей за раз.',
  },

  auth: {
    register: 'Зарегистрироваться',
    registerJiraAccount: 'Создать новый аккаунт Jira',
    resetPassword: 'Восстановить пароль',
    signIn: 'Войти',
    signOut: 'Выйти',
    signInJira: 'Войти в аккаунт Jira',
    scanQrCode: 'Сканируйте QR-код с помощью приложения Google Authenticator и введите код в поле ниже',
    enter2FaCode: 'Введите код из приложения Google Authenticator',
    incorrect2FaCode: 'Неверный код, попробуйте снова',
    recoverPassword: 'Восстановить пароль от аккаунта Jira',
    sendEmail: 'Отправить Email',
    passwordsNotMatch: 'Пароли не совпадают',
  },

  validation: {
    required: 'Обязательное поле',
    incorrectEmailFormat: 'Неверный формат Email',
    usernameTaken: 'Имя пользователя уже занято',
    emailTaken: 'Такой email уже зарегистрирован',
    minChars: 'Минимум 0 символов | Минимум {n} символ | Минимум {n} символа | Минимум {n} символов',
    maxChars: 'Максимум 0 символов | Максимум {n} символ | Максимум {n} символа | Максимум {n} символов',
    upToChars: 'До 0 символов | До {n} символа | До {n} символов | До {n} символов',
  },

  tabs: {
    work: 'Ваша работа',
    projects: 'Проекты',
    filters: 'Фильтры',
    dashboards: 'Дашбоарды',
    people: 'Люди',
    apps: 'Приложения',
  },

  notification: {
    notifications: 'Уведомления',
    showUnread: 'Показать только непрочитанные',

    noLast30Days: 'Нет уведомлений за последние 30 дней',
    noUnreadLast30Days: 'Прочитаны все уведомления за последние 30 дней',

    markRead: 'Отметить как прочитанное',
    markAllRead: 'Отметить все как прочитанные',
    markUnread: 'Отметить как непрочитанное',

    typeTitles: {
      news: 'Новости по приложению Jira',
      issueAssign: 'На вас была назначена задача',
      issueWatchUpdate: 'Наблюдаемая задача была обновлена',
    },
  },

  date: {
    secondsAgo: '0 секунд назад | {n} секунду назад | {n} секунды назад | {n} секунд назад',
    minutesAgo: '0 минут назад | {n} минуту назад | {n} минуты назад | {n} минут назад',
    hoursAgo: '0 час назад | {n} час назад | {n} часа назад | {n} часов назад',
    daysAgo: '0 день назад| {n} день назад | {n} дня назад | {n} дней назад',
    monthsAgo: '0 месяц назад | {n} месяц назад | {n} месяца назад | {n} месяцев назад',

    today: 'Сегодня',
    yesterday: 'Вчера',
    older: 'Более старые',
  },

  table: {
    name: 'Имя',
    key: 'Ключ',
    type: 'Тип',
    template: 'Шаблон',
    leader: 'Руководитель',
    group: 'Группа',
    owner: 'Владелец',
    resetFilters: 'Сбросить фильтры',
  },
};
