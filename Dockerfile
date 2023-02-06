FROM node:latest AS builder
EXPOSE 3000
WORKDIR /app
RUN npm i -g pnpm
COPY . ./
RUN npm install  && pnpm build

FROM node:slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/*.cjs ./
COPY --from=builder /app/*.mjs ./
COPY --from=builder /app/*.json ./
COPY --from=builder /app/*.env ./

