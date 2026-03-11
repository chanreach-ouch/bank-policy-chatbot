import time
from collections import defaultdict, deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class SimpleRateLimitMiddleware(BaseHTTPMiddleware):
    """Small in-memory rate limiter for local/single-process deployments."""

    def __init__(self, app, max_requests_per_minute: int) -> None:
        super().__init__(app)
        self.max_requests_per_minute = max_requests_per_minute
        self._buckets: dict[str, deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/chat/message"):
            client_ip = request.client.host if request.client else "unknown"
            now = time.time()
            window_start = now - 60.0
            bucket = self._buckets[client_ip]

            while bucket and bucket[0] < window_start:
                bucket.popleft()

            if len(bucket) >= self.max_requests_per_minute:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Please try again shortly."},
                )

            bucket.append(now)

        return await call_next(request)

