import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { clerkWebhookHandler } from './webhooks/clerk';
import { getEnv } from './lib/env';
import keepAliveCron from './lib/cron';

import fs from "node:fs";
import path from "node:path";

import * as Sentry from "@sentry/node"

import meRouter from './routes/me.router';
import productRouter from './routes/product.router';
import streamRouter from './routes/stream.router';
import checkoutRouter from './routes/checkout.router';
import adminRouter from './routes/admin.router';
import { sentryClerkUserMiddleware } from './middleware/sentryClerkUser';

dotenv.config();

const env = getEnv();
const app = express();
// const PORT = process.env.PORT || 5000;

const rawJson = express.raw({ type: 'application/json', limit: '1mb' });

app.post('/webhook/clerk', rawJson, (req, res) => {
  // it's important that you don't parse the webhook event data, it should be in raw format
  void clerkWebhookHandler(req, res);
});

// app.post('/webhook/polar', rawJson, (req, res) => {
//   // it's important that you don't parse the webhook event data, it should be in raw format
//   void polarWebhookHandler(req, res);
// });

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use(sentryClerkUserMiddleware);


// if you're not using req in your route handlers, you can omit it and just use _req to avoid linting errors about unused variables. Same goes for res if you don't use it.
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/me", meRouter);
app.use("/api/products", productRouter);
app.use("/api/stream", streamRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/admin", adminRouter);


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


// sentry will be attached to the response object
Sentry.setupExpressErrorHandler(app);


// todo: add error handler middleware here
app.use((_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const sentryId = (res as express.Response & { sentry?: string }).sentry;

  res.status(500).json({
    error: "Internal server error",
    ...(sentryId !== undefined && { sentryId }),
  });
})


app.use(
  (_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const sentryId = (res as express.Response & { sentry?: string }).sentry;

    res.status(500).json({
      error: "Internal server error",
      ...(sentryId !== undefined && { sentryId }),
    });
  },
);


app.listen(env.PORT, () => {
  console.log(`Server is running on port: http://localhost:${env.PORT}`);
  if (env.NODE_ENV === "production") {
    keepAliveCron.start();
  }
});