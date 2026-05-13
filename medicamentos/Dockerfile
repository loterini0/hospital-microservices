FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY medicamentos/package*.json ./
RUN npm install
COPY medicamentos/ .
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 3003
CMD ["npm", "run", "dev"]
