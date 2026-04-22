<template>
  <div class="docs-container p-4">
    <section class="mb-5">
      <h2 class="border-bottom pb-2">🔗 Project Links</h2>
      <div class="d-flex gap-3">
        <a href="https://github.com/joneldiablo/video-chunk" target="_blank" class="btn btn-dark">
          GitHub Repository
        </a>
        <a href="https://www.npmjs.com/package/video-chunk" target="_blank" class="btn btn-outline-dark">
          NPM Package
        </a>
      </div>
    </section>

    <section class="mb-5">
      <h2 class="border-bottom pb-2">🚀 Getting Started</h2>
      
      <div class="card bg-light mb-3">
        <div class="card-body">
          <h5>1. Quick Start (NPM)</h5>
          <p>Install globally or run immediately via npx:</p>
          <pre class="bg-dark text-white p-3 rounded"><code>npm i -g video-chunk<br>npx video-chunk process -i input.mp4 -o ./output -d 60</code></pre>
        </div>
      </div>

      <div class="card bg-light mb-3">
        <div class="card-body">
          <h5>2. From Source (Git)</h5>
          <p>Clone the repository and install dependencies:</p>
          <pre class="bg-dark text-white p-3 rounded"><code>git clone https://github.com/joneldiablo/video-chunk.git<br>cd video-chunk<br>bun install</code></pre>
          <p>Required system dependencies: <strong>FFmpeg</strong></p>
        </div>
      </div>

      <div class="card bg-light">
        <div class="card-body">
          <h5>3. Using Docker (Recommended)</h5>
          <p>Clone the repo and build the image:</p>
          <pre class="bg-dark text-white p-3 rounded"><code>git clone https://github.com/joneldiablo/video-chunk.git<br>cd video-chunk<br>docker build -t video-chunk .<br>docker run -p 3020:3000 video-chunk</code></pre>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <h2 class="border-bottom pb-2">💻 CLI Usage</h2>
      <p>The CLI is the main entry point for headless processing.</p>
      <div class="card bg-light">
        <div class="card-body">
          <h5>Process a video into chunks:</h5>
          <pre class="bg-dark text-white p-3 rounded"><code>bun run cli.ts process -i input.mp4 -o ./output -d 60</code></pre>
          <ul class="mt-2">
            <li><code>-i, --input</code>: Path to input video.</li>
            <li><code>-o, --output</code>: Path to output directory.</li>
            <li><code>-d, --duration</code>: Chunk length in seconds (default: 60).</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mb-5">
      <h2 class="border-bottom pb-2">🌐 Express Server</h2>
      <p>The server provides a REST API and an optional admin panel.</p>
      <div class="card bg-light">
        <div class="card-body">
          <h5>Configuration & Environment</h5>
          <div class="table-responsive mb-3">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>CLI Flag</th>
                  <th>Default</th>
                  <th>Effect</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>PORT</code></td>
                  <td><code>-p, --port</code></td>
                  <td><code>3000</code></td>
                  <td>Sets the server listening port.</td>
                </tr>
                <tr>
                  <td><code>ENABLE_FRONTEND</code></td>
                  <td><code>-f, --frontend</code></td>
                  <td><code>false</code></td>
                  <td>Enables the Vue administration panel.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h5>Endpoints:</h5>
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item"><code>POST /api/upload</code>: Uploads a video and returns a jobId.</li>
            <li class="list-group-item"><code>POST /api/process</code>: Splits video by jobId.</li>
            <li class="list-group-item"><code>GET /api/download/:jobId</code>: Downloads chunks as ZIP.</li>
          </ul>
          
          <h5>Start the server:</h5>
          <pre class="bg-dark text-white p-3 rounded"><code>bun run cli.ts server --port 3000 --frontend true</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.docs-container {
  color: #333;
}
pre {
  font-size: 0.9rem;
}
</style>
