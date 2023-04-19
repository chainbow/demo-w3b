FROM node:18.13.0
WORKDIR /app
RUN npm i -g pnpm

COPY . .

RUN pnpm i
RUN pnpm build

EXPOSE 3000
