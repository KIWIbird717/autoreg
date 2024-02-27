# Используйте официальный образ Node.js в качестве базового образа
FROM node:18

# Установите рабочую директорию в контейнере
WORKDIR /usr/src/backend-express

# Копируйте файлы `package.json` и `package-lock.json` (если есть)
COPY package*.json ./

# Установите зависимости
# Если вы строите свой код для продакшена, запустите `npm ci --only=production`
RUN npm install

# Копируйте исходные коды приложения
COPY . .

# Скомпилируйте TypeScript в JavaScript
RUN npm run build

# Откройте порт, который будет слушать ваше приложение
EXPOSE 8080
EXPOSE 8081

# Запустите приложение
CMD [ "npm", "start" ]