# video-chunk

A clean, modular tool for splitting videos into equal parts. Can be used as a CLI tool or a web service with an administration panel.

[GitHub](https://github.com/joneldiablo/video-chunk) | [NPM](https://www.npmjs.com/package/video-chunk)

## Tech Stack
- **Runtime**: Bun
- **Language**: TypeScript
- **CLI**: yargs
- **Server**: Express
- **Frontend**: Vue 3 + Bootstrap 5

## Installation

### Prerequisites
- [Bun](https://bun.sh)
- FFmpeg installed on the system

### Setup
```bash
bun install
```

## Usage

### CLI
The tool can be executed via `bun run cli.ts`.

**Process a video:**
```bash
bun run cli.ts process -i input.mp4 -o ./output -d 60
```
- `-i, --input`: Path to the input video file.
- `-o, --output`: Path to the output directory.
- `-d, --duration`: Duration of each chunk in seconds (default: 60).

**Start the web server:**
```bash
bun run cli.ts server --port 3000 --frontend true
```
- `--port`: Port to run the server on (default: 3000).
- `--frontend`: Enable/disable the admin panel.

### Web Server
When the server is running with `--frontend true`, you can access the admin panel at `http://localhost:3000`.

## Environment Variables & CLI Parameters

The system allows configuration via environment variables or CLI flags. CLI flags always take precedence over environment variables.

| Variable | CLI Flag | Default | Description | Effect |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | `-p, --port` | `3000` | Server port | Defines the port where the Express server will listen. |
| `ENABLE_FRONTEND` | `-f, --frontend` | `false` | Enable Admin UI | If `true`, the server serves the Vue administration panel. |
| `FRONTEND_PATH` | `--frontend-path` | Auto-detected | Frontend path | Path to the frontend build directory. Useful for custom installations. |

**Example using Environment Variables:**
```bash
PORT=4000 ENABLE_FRONTEND=true bun run cli.ts server
```

**Example using CLI Flags:**
```bash
bun run cli.ts server --port 4000 --frontend true
```

## Project Structure
- `cli.ts`: Main entry point for the CLI.
- `backend/`: Core logic, services, and API.
- `frontend/`: Vue 3 administration panel.
- `agents/`: Agent definitions and prompts.
- `reports/`: Logs and processing results.
