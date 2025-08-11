FROM postgres:15-alpine

# Set environment variables
ENV POSTGRES_DB=telegram_bot_saas
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=TelegramBotSaas2024!@#
ENV PGDATA=/var/lib/postgresql/data/pgdata

# Copy initialization scripts
COPY migrations/*.sql /docker-entrypoint-initdb.d/
COPY seeds/*.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB