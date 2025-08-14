import { createServer, IncomingMessage, ServerResponse } from "http";
import { match as pathMatch, MatchFunction } from "path-to-regexp";
import { MyRequest, MyResponse } from "./types";

type HttpMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Handler = (req: MyRequest, res: MyResponse) => void | Promise<void>;

class App {
  private routes: Map<string, Handler[]>;

  constructor() {
    this.routes = new Map();
  }

  private createMyServer() {
    return createServer((req, res) => this.serverHandler(req, res));
  }

  private addRoute(method: HttpMethods, path: string, ...handlers: Handler[]) {
    const key = `${path}/${method}`;
    const existing = this.routes.get(key) || [];
    this.routes.set(key, [...existing, ...handlers]);
  }

  private sanitizeUrl(url: string, method: string): string {
    const urlParts = url.split("/");
    const cleanedParts: string[] = [];

    for (let i = 1; i < urlParts.length; i++) {
      const part = urlParts[i].split("?")[0];
      cleanedParts.push(part);
    }

    return `/${cleanedParts.join("/")}/${method.toUpperCase()}`;
  }

  private matchUrl(
    sanitizedUrl: string
  ): { pathKey: string; params: Record<string, string> } | null {
    for (const path of Array.from(this.routes.keys())) {
      const matcher: MatchFunction<object> = pathMatch(path, {
        decode: decodeURIComponent,
      });
      const result = matcher(sanitizedUrl);
      if (result) {
        return {
          pathKey: path,
          params: result.params as Record<string, string>,
        };
      }
    }
    return null;
  }

  private async serverHandler(req: IncomingMessage, res: ServerResponse) {
    const resCustom = res as MyResponse;
    const reqCustom = req as MyRequest;

    resCustom.send = (data: string) => {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/plain");
      }
      res.write(data);
      res.end();
    };

    resCustom.json = (data: unknown) => {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "application/json");
      }
      res.write(JSON.stringify(data));
      res.end();
    };

    resCustom.status = (code: number) => {
      res.statusCode = code;
      return resCustom;
    };

    const sanitized = this.sanitizeUrl(
      reqCustom.url || "",
      reqCustom.method || ""
    );
    const matched = this.matchUrl(sanitized);

    const fullUrl = `http://localhost${reqCustom.url}`;
    const parsedUrl = new URL(fullUrl);
    const queryParams: Record<string, string> = {};

    parsedUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    reqCustom.query = queryParams;
    reqCustom.params = {};
    reqCustom.body = {};

    if (matched) {
      const handlers = this.routes.get(matched.pathKey) || [];
      reqCustom.params = matched.params;

      try {
        if (req.method !== "GET") {
          let body = "";
          for await (const chunk of req) {
            body += chunk;
          }
          if (body) {
            reqCustom.body = JSON.parse(body);
          }
        }
      } catch (error) {
        console.error("Error parsing request body:", error);
      }

      for (const handler of handlers) {
        await handler(reqCustom, resCustom);
        if (resCustom.writableEnded) return;
      }

      if (!resCustom.writableEnded) {
        resCustom.end();
      }
    } else {
      resCustom.statusCode = 404;
      resCustom.end("Not found");
    }
  }

  run(port: number) {
    const server = this.createMyServer();
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  }

  get(path: string, ...handlers: Handler[]) {
    return this.addRoute("GET", path, ...handlers);
  }

  post(path: string, ...handlers: Handler[]) {
    return this.addRoute("POST", path, ...handlers);
  }

  put(path: string, ...handlers: Handler[]) {
    return this.addRoute("PUT", path, ...handlers);
  }

  patch(path: string, ...handlers: Handler[]) {
    return this.addRoute("PATCH", path, ...handlers);
  }

  del(path: string, ...handlers: Handler[]) {
    return this.addRoute("DELETE", path, ...handlers);
  }
}

export default App;