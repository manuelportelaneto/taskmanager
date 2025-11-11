# Estágio 1: Builder
FROM node:20-bookworm AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: Produção
FROM node:20-bookworm-slim
WORKDIR /usr/src/app

# A CORREÇÃO ESTÁ AQUI: Removemos a flag errada da linha do 'COPY package'
COPY --from=builder /usr/src/app/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]