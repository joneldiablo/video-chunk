# Video Chunk - Agent Documentation

## Tech Stack

- **Runtime**: Bun (development) / Node.js (production)
- **Build**: Bun + TypeScript -> CommonJS for Node compatibility
- **Frontend**: Vue 3 + Vite
- **Backend**: Express + TypeScript

## Important: Bun to Node Compatibility

This project uses **Bun** for development and building, but the final build output is **Node.js compatible** (CommonJS). This allows:

```bash
npm i -g video-chunk   # Install globally with npm
videoChunk server      # Run with Node
```

### Why CommonJS?

The CLI is compiled to CommonJS because:
1. Node's `require()` works out of the box
2. Global npm installation works seamlessly
3. No need for `"type": "module"` in package.json

## Build Process

```bash
bun run build          # Full build (frontend + backend)
bun run build:frontend # Build Vue frontend with Vite
bun run build:backend # Compile TypeScript with tsc
```

Output structure:
```
dist/
├── cli.js        # Entry point (Node compatible, shebang: #!/usr/bin/env node)
├── backend/      # Compiled backend (CommonJS)
│   └── tmp/      # Temp files directory (created at runtime)
└── frontend/     # Production build from Vite
```

## Development

```bash
bun run cli.ts server --frontend   # Run with Bun (dev)
node dist/cli.js server --frontend # Run built version (prod test)
```

## Testing

### Dockerfile.test.local
Tests installation from local build:
```bash
docker build -f Dockerfile.test.local -t video-chunk-test .
docker run --rm video-chunk-test videoChunk process -i video.mp4 -o /tmp/output -d 2
```

### Dockerfile.test
Tests installation from npm registry:
```bash
docker build -f Dockerfile.test -t video-chunk-npm .
docker run --rm video-chunk-npm videoChunk process -i video.mp4 -o /tmp/output -d 2
```

## Key Files

- `cli.ts` - Main CLI entry point (shebang: `#!/usr/bin/env node`)
- `backend/src/api/server.ts` - Express server (uses `__dirname` for path resolution)
- `tsconfig.json` - TypeScript config (module: CommonJS)
- `package.json` - Build scripts and bin config
- `frontend/vite.config.ts` - Vue frontend build config

## Notes for Agents

1. **Always rebuild** after modifying TypeScript files: `bun run build`
2. **Path resolution**: Server uses `__dirname` relative to compiled location, not `process.cwd()`
3. **Frontend paths**: Served from `dist/frontend/` (Vite output copied here)
4. **Tmp directory**: Created automatically at runtime in `dist/backend/tmp/`
