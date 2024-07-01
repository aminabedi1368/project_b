# Stage 1: Build
FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Test
FROM builder as tester

WORKDIR /app
COPY --from=builder /app /app
RUN npm run test

# Stage 3: Run
FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
