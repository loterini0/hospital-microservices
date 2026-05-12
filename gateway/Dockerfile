FROM php:8.3-fpm-alpine
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    zip \
    unzip \
    git \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        mbstring \
        xml \
        bcmath
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY gateway/composer.json gateway/composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist
COPY gateway/ .
RUN composer dump-autoload --optimize
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
COPY gateway/docker/nginx.conf /etc/nginx/http.d/default.conf
COPY gateway/docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE 8000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
