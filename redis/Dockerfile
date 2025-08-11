FROM redis:7-alpine

# Copy custom Redis configuration if needed
# COPY redis.conf /usr/local/etc/redis/redis.conf

# Set default Redis configuration
RUN echo "appendonly yes" >> /etc/redis.conf && \
    echo "appendfsync everysec" >> /etc/redis.conf && \
    echo "maxmemory-policy allkeys-lru" >> /etc/redis.conf

# Expose Redis port
EXPOSE 6379

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD redis-cli ping

# Start Redis server
CMD ["redis-server", "/etc/redis.conf"]