from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Cloudflare ASE Demo</title>
    </head>

    <body>
        <h1>Cloudflare ASE Demo Application</h1>

        <p>This application is running on my origin server.</p>

        <h2>Origin Status: Healthy</h2>

        <p>Architecture: Client → Cloudflare → Origin Server</p>

        <h3>Available Endpoints</h3>

        <p>/ - Homepage</p>
        <p>/health - Health check</p>
        <p>/search?q=test - Search demo</p>
    </body>
    </html>
    """


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "cloudflare-ase-origin"
    }


@app.get("/search")
def search(q: str = ""):
    return {
        "query": q,
        "message": f"Search received for: {q}"
    }
@app.get("/secure", response_class=HTMLResponse)
def secure():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Secure Area</title>
    </head>
    <body>
        <h1>Secure Area</h1>
        <p>You successfully authenticated through Cloudflare Access.</p>
    </body>
    </html>
    """

