import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse as parseUrl } from 'node:url';

type Handler = (req: IncomingMessage & { params?: Record<string, string> }, res: ServerResponse) => void;

interface Routes {
  [method: string]: {
    [path: string]: Handler;
  };
}

export class ExpressPlus {
  private routes: Routes = {};

  addRoute(method: string, path: string, handler: Handler): void {
    if (!this.routes[method]) {
      this.routes[method] = {};
    }
    this.routes[method][path] = handler;
  }

  get(path: string, handler: Handler): void {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: Handler): void {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: Handler): void {
    this.addRoute('PUT', path, handler);
  }

  delete(path: string, handler: Handler): void {
    this.addRoute('DELETE', path, handler);
  }

  patch(path: string, handler: Handler): void {
    this.addRoute('PATCH', path, handler);
  }

  private matchRoute(method: string, path: string): { handler?: Handler; params?: Record<string, string> } {
    const methodRoutes = this.routes[method];
    if (!methodRoutes) return {};

    for (const routePath in methodRoutes) {
      const paramNames: string[] = [];
      const regexPath = routePath.replace(/:([^/]+)/g, (_, key) => {
        paramNames.push(key);
        return '([^/]+)';
      });
      const regex = new RegExp(`^${regexPath}$`);
      const match = path.match(regex);

      if (match) {
        const params: Record<string, string> = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler: methodRoutes[routePath], params };
      }
    }

    return {};
  }

  listen(port: number, callback?: () => void): void {
    const server = createServer((req, res) => {
      const method = req.method || 'GET';
      const url = parseUrl(req.url || '', true);
      const path = url.pathname || '';
      const { handler, params } = this.matchRoute(method, path);

      if (handler) {
        (req as IncomingMessage & { params?: Record<string, string> }).params = params;
        handler(req as IncomingMessage & { params?: Record<string, string> }, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(port, callback);
  }
}

// Example usage:
const app = new ExpressPlus();

app.get('/users', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ user: [] }));
});

app.post('/users', (req, res) => {
  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'User created' }));
});

app.put('/users/:id', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'User updated' }));
});

app.patch('/users/:id', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'User patched' }));
});

app.delete('/users/:id', (req, res) => {
  res.writeHead(204);
  res.end();
});

export default ExpressPlus;
