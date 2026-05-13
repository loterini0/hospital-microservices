FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    FLASK_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN useradd -m -u 1000 appuser
WORKDIR /app
COPY historiales/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt && pip install gunicorn
COPY historiales/ .
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 8002
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:8002 --workers 2 app:app 2>/dev/null || python app.py"]
