import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse as parseUrl } from 'node:url';

export class ExpressPlus {
  private routes: {
    [method: string]: {
      [path: string]: Function;
    };
  };

  constructor() {
    this.routes = {};
  }

  private addRoute(method: string, path: string, handler: Function) {
    this.routes[method] = this.routes[method] || {};
    this.routes[method][path] = handler;
  }

  public get(path: string, handler: Function) {
    this.addRoute('GET', path, handler);
  }

  public post(path: string, handler: Function) {
    this.addRoute('POST', path, handler);
  }

  public put(path: string, handler: Function) {
    this.addRoute('PUT', path, handler);
  }

  public delete(path: string, handler: Function) {
    this.addRoute('DELETE', path, handler);
  }

  public patch(path: string, handler: Function) {
    this.addRoute('PATCH', path, handler);
  }

  private matchRoute(method: string, path: string): { handler?: Function; params?: any } {
    const methodRoutes = this.routes[method];
    if (!methodRoutes) return {};

    for (const routePath in methodRoutes) {
      const paramsNames: string[] = [];
      const regexPath = routePath.replace(/:([^/]+)/g, (_, key) => {
        paramsNames.push(key);
        return '([^/]+)';
      });

      const regex = new RegExp(`^${regexPath}$`);
      const match = path.match(regex);

      if (match) {
        const params: Record<string, string> = {};
        paramsNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler: methodRoutes[routePath], params };
      }
    }

    return {};
  }

  private parseBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve(parsed);
        } catch (error) {
          resolve({});
        }
      });

      req.on('error', reject);
    });
  }

  private extendResponse(res: ServerResponse): any {
    let statusCode = 200;

    const extendedRes = res as ServerResponse & {
      status: (code: number) => typeof extendedRes;
      json: (data: any) => void;
      send: (data: any) => void;
    };

    extendedRes.status = (code: number) => {
      statusCode = code;
      return extendedRes;
    };

    extendedRes.json = (data: any) => {
      res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end(JSON.stringify(data));
    };

    extendedRes.send = (data: any) => {
      if (typeof data === 'object') {
        extendedRes.json(data);
      } else {
        res.writeHead(statusCode, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(String(data));
      }
    };

    return extendedRes;
  }

  public listen(port: number, callback?: () => void) {
    const server = createServer(async (req, res) => {
      const method = req.method || 'GET';
      const url = parseUrl(req.url || '', true);
      const path = url.pathname || '';

      const { handler, params } = this.matchRoute(method, path);

      if (!handler) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      const extendedReq = req as IncomingMessage & {
        params?: any;
        query?: any;
        body?: any;
      };

      extendedReq.params = params;
      extendedReq.query = url.query;

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          extendedReq.body = await this.parseBody(req);
        } catch {
          extendedReq.body = {};
        }
      }

      const extendedRes = this.extendResponse(res);
      handler(extendedReq, extendedRes);
    });

    server.listen(port, callback);
  }
}

export default ExpressPlus;
