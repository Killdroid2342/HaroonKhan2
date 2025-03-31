# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install required dependencies
RUN apt-get update && apt-get install -y \
    curl \
    libcurl4-openssl-dev \
    libssl-dev \
    default-mysql-client \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache SSL module
RUN a2enmod ssl

# Copy application files
COPY . /var/www/html/

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Copy SSL certificates (Make sure you have these in your project)
COPY singlestore_bundle.pem ./singlestore_bundle.pem

# Expose ports
EXPOSE 80 443

# Start Apache
CMD ["apache2-foreground"]
