# Autoreg frontend documentation

## Структура проекта

├── .DS_Store
├── .env
├── .gitignore
├── declarations.d.ts
├── package-lock.json
├── package.json
├── public
├── README.md
├── src
│ ├── App.tsx
│ ├── components **# компоненты и лейауты для страниц**
│ ├── global-style
│ ├── globalTypes.d.ts **# declarations**
│ ├── hooks
│ ├── images
│ ├── index.tsx
│ ├── pages
│ │ ├── Application.tsx
│ │ ├── ApplicationPages **# тут расположены все страницы приложения**
│ │ ├── Logining.tsx
│ │ └── Registration.tsx
│ ├── store **# redux store slices**
│ └── utils
├── tailwind.config.js
└── tsconfig.json

## Основные фреймворки и библиотеки

**Разработка**

- React
- axios
- react-router-dom
- redux

**Стилизация**

- styled components
- sass
- react-lottie
- [tailwind](https://tailwindcss.com)
- [framer-motion](https://www.framer.com/motion/)
- [antd](https://ant.design)
- [mui](https://mui.com)

## Глобальное хранилище. Redux

#### Общий Обзор

В проекте "Autoreg" используется Redux для управления глобальным состоянием приложения. Глобальное хранилище разделено на два основных сегмента: `userSlice` и `appSlice`. Эти сегменты управляют состояниями, связанными соответственно с пользовательскими данными и общими параметрами приложения.

#### Конфигурация Хранилища

Хранилище конфигурируется в файле `WebApp/src/store/store.ts`, где используется `configureStore` из `@reduxjs/toolkit`. Хранилище состоит из двух основных слайсов: `user` и `app`, которые представлены соответствующими срезами (`userSlice`, `appSlice`).

#### Slice `appSlice`

`appSlice` управляет состоянием, связанным с общими аспектами приложения. В состояние включены параметры, такие как текущая страница приложения, папки менеджеров, данные о пользователях и логи.

#### Slice `userSlice`

`userSlice` управляет состоянием, связанным с пользовательскими данными. Он содержит информацию о пользователях, такую как никнейм, почта, токен доступа и статус входа в систему.

#### Типы Данных

В файле `WebApp/src/store/types.d.ts` определены типы данных, используемые в глобальном хранилище.

## Описание маршрутизации в проекте

#### Общий Обзор

Проект "Autoreg" использует `react-router-dom` для навигации и маршрутизации между различными страницами приложения. Основная структура страниц и маршрутов организована в папке `pages`

#### Страницы и Подстраницы

- **`ApplicationPages`**: Хранит подстраницы приложения, такие как `AccountsManager`, `Autoreg`, `Distribution`, `Inviting`, `Logs`, `ParsingPage`, `ProxyManager`, `Settings`, `WarmingUp`.
- **`Logining` и `Registration`**: Отдельные страницы для процессов входа в систему и регистрации.

#### Страницы и Подстраницы

- **`ApplicationPages`**: Хранит подстраницы приложения: `AccountsManager`, `Autoreg`, `Distribution`, `Inviting`, `Logs`, `ParsingPage`, `ProxyManager`, `Settings`, `WarmingUp`.
- **`Logining` и `Registration`**: Отдельные страницы для процессов входа в систему и регистрации.

#### Маршрутизация (`RouterPages.tsx`)

Файл `RouterPages.tsx` управляет всей навигацией в приложении. Он содержит следующие ключевые элементы:

- Импорты страниц `AutoRegPage`, `AccountsManagerPage`, `LogsPage`, `ProxyManagerPage`, `SettingsPage`, `WarmingUpPage`, `DistributionPage`, `ParsingPage`, `InvitingPage`.
- Маршруты определены внутри компонента `<Routes>`, который включает `<Route>` для каждой страницы.
- Автоматический выход из системы при превышении максимальной длительности сессии (`MAX_SESSION_DURATION`).

#### Глобальный Wrapper (`Application.tsx`)

Файл `Application.tsx` действует как wrapper (layout) для всего приложения. Основные характеристики:

- Использование `ConfigProvider` и `Layout` из `antd` для создания единого стиля для всех компонентов из библиотеки.
- Интеграция `SiderComponent`. Сайдбар для навигации по страницам

#### Страницы Входа и Регистрации (`Logining.tsx` и `Registration.tsx`)

- **`Logining.tsx`**: Управляет процессом входа пользователя, включая форму ввода и обработку запросов на вход.
- **`Registration.tsx`**: Управляет процессом регистрации пользователя, предоставляя форму для ввода данных и отправку запросов на регистрацию.
