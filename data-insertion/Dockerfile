FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 1433
CMD ["npm", "start"]