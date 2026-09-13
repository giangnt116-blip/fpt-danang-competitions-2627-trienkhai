import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Trong dev sandbox của AI Studio, Nginx reverse proxy chuyển tiếp traffic tới port 3000.
// Khi deploy lên Cloud Run production, Cloud Run yêu cầu ứng dụng lắng nghe trên cổng process.env.PORT (mặc định 8080).
const isDevSandbox = Boolean(process.env.DEFAULT_APP_PORT || process.env.CONTROL_PLANE_PORT);
const PORT = isDevSandbox
  ? 3000
  : (Number(process.env.PORT) || 3000);
const HOST = '0.0.0.0';

// Ưu tiên phục vụ static assets từ thư mục public/ (tương thích Vercel Production và CDN)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Fallback static root tạm thời sau public để tương thích hoàn toàn
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Fallback all other routes to public/index.html
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
