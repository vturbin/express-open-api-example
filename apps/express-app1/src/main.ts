/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import orderRoutes from './routes/orders.routes';

const app = express();
const fs = require('fs');
const YAML = require('yaml');

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const spec = path.join(__dirname, 'openapi/openapi.yaml');
app.use('/spec', express.static(spec));

// Serve API Docs
const file = fs.readFileSync(spec, 'utf8');
const swaggerDocument = YAML.parse(file);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  OpenApiValidator.middleware({
    apiSpec: spec,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  })
);

app.use('/orders', orderRoutes);

// Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message, errors: err.errors });
});

// 6. Create an Express error handler
app.use((err, _req, res, _next) => {
  // 7. Customize errors
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
