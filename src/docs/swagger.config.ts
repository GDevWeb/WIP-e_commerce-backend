import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";

// --- 1. CONFIGURATION SWAGGER JSDOC ---
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Backend API",
      version: "1.0.0",
      description: "API Documentation for E-commerce Backend",
    },
    servers: [
      {
        url: "/api", // Chemin relatif pour Vercel
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/modules/*/routes/*.ts", "./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

// --- 2. FONCTION DE SETUP (Version HTML Manuelle) ---
export const setupSwagger = (app: Express) => {
  // Route JSON pour la spécification brute
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Route HTML Manuelle : On ne dépend plus de swagger-ui-express pour servir les fichiers
  app.get("/api-docs", (req: Request, res: Response) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>E-Commerce API Docs</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin: 0; background: #fafafa; }
          .swagger-ui .topbar { display: none; } /* Cacher la barre verte du haut */
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js"></script>
        
        <script>
          window.onload = function() {
            // Configuration Swagger UI
            const ui = SwaggerUIBundle({
              spec: ${JSON.stringify(
                swaggerSpec
              )}, // On injecte la spec directement dans le HTML
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "BaseLayout", // Layout sans la barre de recherche du haut
              persistAuthorization: true,
            });
            window.ui = ui;
          };
        </script>
      </body>
      </html>
    `;
    res.send(html);
  });

  console.log("📚 Swagger documentation available at /api-docs");
};
