/**
 * Next.js config with rewrites to backend services running locally.
 * Routes starting with /v1/sms and /v1/blocked are proxied to sms-sender (8080).
 * Routes starting with /v1/user and /v1/admin are proxied to sms-store (8081).
 */
module.exports = {
  async rewrites() {
    return [
      // sms-sender endpoints
      { source: '/v1/sms', destination: 'http://localhost:8080/v1/sms' },
      { source: '/v1/sms/:path*', destination: 'http://localhost:8080/v1/sms/:path*' },
      { source: '/v1/blocked', destination: 'http://localhost:8080/v1/blocked' },
      { source: '/v1/blocked/:path*', destination: 'http://localhost:8080/v1/blocked/:path*' },
      // sms-store endpoints
      { source: '/v1/user', destination: 'http://localhost:8081/v1/user' },
      { source: '/v1/user/:path*', destination: 'http://localhost:8081/v1/user/:path*' },
      { source: '/v1/admin', destination: 'http://localhost:8081/v1/admin' },
      { source: '/v1/admin/:path*', destination: 'http://localhost:8081/v1/admin/:path*' }
    ]
  }
}
