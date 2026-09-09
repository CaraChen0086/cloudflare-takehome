# cloudflare-takehome
Cloudflare Associate Solutions Engineer Take-Home Assessment

## Live Demo

### Part 1 — Application Services

Application:
https://app.cara-demo-jhu.uk

Search endpoint:
https://app.cara-demo-jhu.uk/search?q=test

### Part 2 — Zero Trust

Tunnel application:
https://tunnel.cara-demo-jhu.uk

Protected path:
https://tunnel.cara-demo-jhu.uk/secure

The `/secure` path is protected by Cloudflare Access using email-based
One-Time Pin authentication. Access is allowed for the configured owner
account and users with an `@cloudflare.com` email address.

### Part 3 — Developer Platform

Authenticated Worker:
https://worker.cara-demo-jhu.uk/secure

R2 flag endpoint:
https://worker.cara-demo-jhu.uk/flags/US

D1 flag endpoint:
https://worker.cara-demo-jhu.uk/flags-d1/US
