
FROM php:8.2-apache


WORKDIR /var/www/html

RUN apt-get update && apt-get install -y libcurl4-openssl-dev && rm -rf /var/lib/apt/lists/*


COPY . /var/www/html/


RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html


EXPOSE 80


CMD ["apache2-foreground"]