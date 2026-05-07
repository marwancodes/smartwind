import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhookHandler } from './webhooks/clerk';
import { getEnv } from './lib/env';

import fs from "node:fs";
import path from "node:path";

dotenv.config();

const env = getEnv();
const app = express();
// const PORT = process.env.PORT || 5000;

const rawJson = express.raw({ type: 'application/json', limit: '1mb' });

app.post('/webhook/clerk', rawJson, (req, res) => {
  // it's important that you don't parse the webhook event data, it should be in raw format
  void clerkWebhookHandler(req, res);
});

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
};


app.listen(env.PORT, () => {
  console.log(`Server is running on port: http://localhost:${env.PORT}`);
});