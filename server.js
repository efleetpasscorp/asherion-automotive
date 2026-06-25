const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3000
const HOST = "0.0.0.0"
const ROOT = __dirname

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8" })
  res.end(body)
}

function tryFiles(pathname) {
  // Candidate paths to support cleanUrls (e.g. /about -> about.html)
  const candidates = []
  const clean = pathname.replace(/\/+$/, "") || "/"

  if (clean === "/") {
    candidates.push("index.html")
  } else {
    const rel = clean.replace(/^\/+/, "")
    candidates.push(rel)
    candidates.push(rel + ".html")
    candidates.push(path.join(rel, "index.html"))
  }
  return candidates
}

const server = http.createServer((req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname)
  } catch {
    return send(res, 400, "Bad Request")
  }

  for (const candidate of tryFiles(pathname)) {
    const filePath = path.join(ROOT, candidate)
    // Prevent path traversal
    if (!filePath.startsWith(ROOT)) continue
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      const data = fs.readFileSync(filePath)
      return send(res, 200, data, MIME[ext] || "application/octet-stream")
    }
  }

  // 404 fallback
  const notFound = path.join(ROOT, "404.html")
  if (fs.existsSync(notFound)) {
    return send(res, 404, fs.readFileSync(notFound), MIME[".html"])
  }
  return send(res, 404, "Not Found")
})

server.listen(PORT, HOST, () => {
  console.log(`[v0] Asherion Automotive static site running at http://${HOST}:${PORT}`)
})
