FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and libstdc++ for Prisma compatibility
RUN apk add --no-cache openssl libstdc++

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
