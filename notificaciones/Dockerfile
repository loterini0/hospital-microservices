FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY notificaciones/package*.json ./
RUN npm install
COPY notificaciones/ .
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3002
CMD ["npm", "run", "start"]
