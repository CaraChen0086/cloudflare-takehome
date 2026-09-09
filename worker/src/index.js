export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --------------------------------------------------
    // 1. Protected endpoint: /secure
    // --------------------------------------------------
    if (url.pathname === "/secure") {
      if (!ctx.access) {
        return new Response("Access required", {
          status: 403,
          headers: {
            "content-type": "text/plain;charset=UTF-8",
          },
        });
      }

      const identity = await ctx.access.getIdentity();
      const email = identity?.email ?? "unknown";

      const timestamp = new Date().toISOString();
      const country = request.cf?.country || "XX";

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Cloudflare Worker Secure Page</title>
          </head>
          <body>
            <h1>Cloudflare Worker Secure Page</h1>
            <p>
              ${email} authenticated at ${timestamp} from
              <a href="/flags/${country}">${country}</a>
            </p>
          </body>
        </html>
      `;

      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }

    // --------------------------------------------------
    // 2. R2 flag endpoint: /flags/US
    // --------------------------------------------------
    if (url.pathname.startsWith("/flags/")) {
      const countryCode = url.pathname
        .split("/")
        .pop()
        .toLowerCase();

      const key = `${countryCode}.png`;

      const object = await env.cara_demo_flags.get(key);

      if (object === null) {
        return new Response(`Flag not found for ${countryCode}`, {
          status: 404,
        });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("Content-Type", "image/png");
      headers.set("ETag", object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    }

    // --------------------------------------------------
    // 3. D1 flag endpoint: /flags-d1/US
    // --------------------------------------------------
    if (url.pathname.startsWith("/flags-d1/")) {
      const countryCode = url.pathname
        .split("/")
        .pop()
        .toUpperCase();

      const flag = await env.cara_demo_flags_d1
        .prepare(
          "SELECT content_type, data FROM flags WHERE country = ?"
        )
        .bind(countryCode)
        .first();

      if (!flag) {
        return new Response(`Flag not found for ${countryCode}`, {
          status: 404,
        });
      }

      const binaryString = atob(flag.data);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new Response(bytes, {
        headers: {
          "Content-Type": flag.content_type,
        },
      });
    }

    // --------------------------------------------------
    // Home page
    // --------------------------------------------------
    return new Response(
      `Cloudflare ASE Worker is running.

Try:
https://worker.cara-demo-jhu.uk/secure
https://worker.cara-demo-jhu.uk/flags/US
https://worker.cara-demo-jhu.uk/flags-d1/US`,
      {
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      }
    );
  },
};
