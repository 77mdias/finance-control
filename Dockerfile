FROM node:22-alpine AS base

WORKDIR /app

# Prisma requires OpenSSL; libc6-compat improves musl compatibility for native deps.
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000

COPY package.json package-lock.json ./
# Work around peer dependency conflict (@neondatabase/vite-plugin-postgres expects Vite ^6).
RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
