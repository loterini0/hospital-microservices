FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY usuarios/package*.json ./
RUN npm install
COPY usuarios/ .
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3001
CMD ["npm", "run", "dev"]
