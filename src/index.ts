export class MathUtils {
  private routes: {
    [method: string]: {
      [path: string]: (...args: number[]) => number;
    };
  };

  constructor() {
    // Initialize empty routes for each method
    this.routes = {
      'GET': {},
      'POST': {},
      'PUT': {},
      'DELETE': {},
      'PATCH': {}
    };

    // Register default operations
    this.registerOperations();
  }

  private registerOperations() {
    // Register sum operations
    this.get('/sum', this.sum.bind(this));
    this.post('/sum', this.sum.bind(this));
    this.put('/sum', this.sum.bind(this));
    this.delete('/sum', this.sum.bind(this));
    this.patch('/sum', this.sum.bind(this));

    // Register subtraction operations
    this.get('/sub', this.sub.bind(this));
    this.post('/sub', this.sub.bind(this));
    this.put('/sub', this.sub.bind(this));
    this.delete('/sub', this.sub.bind(this));
    this.patch('/sub', this.sub.bind(this));

    // Register multiplication operations
    this.get('/mul', this.mul.bind(this));
    this.post('/mul', this.mul.bind(this));
    this.put('/mul', this.mul.bind(this));
    this.delete('/mul', this.mul.bind(this));
    this.patch('/mul', this.mul.bind(this));

    // Register division operations
    this.get('/div', this.div.bind(this));
    this.post('/div', this.div.bind(this));
    this.put('/div', this.div.bind(this));
    this.delete('/div', this.div.bind(this));
    this.patch('/div', this.div.bind(this));

    // Register modulo operations
    this.get('/mod', this.mod.bind(this));
    this.post('/mod', this.mod.bind(this));
    this.put('/mod', this.mod.bind(this));
    this.delete('/mod', this.mod.bind(this));
    this.patch('/mod', this.mod.bind(this));
  }

  private sum(...numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
  }

  private sub(first: number, ...rest: number[]): number {
    return rest.length === 0 ? first : rest.reduce((acc, num) => acc - num, first);
  }

  private mul(first: number, ...rest: number[]): number {
    return rest.length === 0 ? first : rest.reduce((acc, num) => acc * num, first);
  }

  private div(first: number, ...rest: number[]): number {
    if (rest.some(num => num === 0)) {
      throw new Error("Division by zero is not allowed");
    }
    return rest.length === 0 ? first : rest.reduce((acc, num) => acc / num, first);
  }

  private mod(first: number, ...rest: number[]): number {
    return rest.length === 0 ? first : rest.reduce((acc, num) => acc % num, first);
  }

  private addRoute(method: string, path: string, handler: (...args: number[]) => number): void {
    this.routes[method][path] = handler;
  }

  public get(path: string, handler: (...args: number[]) => number): void;
  public get(path: string, ...args: number[]): number;
  public get(path: string, ...args: any[]): any {
    if (args.length === 1 && typeof args[0] === 'function') {
      this.addRoute('GET', path, args[0]);
      return;
    }
    return this.routes['GET'][path](...args);
  }

  public post(path: string, handler: (...args: number[]) => number): void;
  public post(path: string, ...args: number[]): number;
  public post(path: string, ...args: any[]): any {
    if (args.length === 1 && typeof args[0] === 'function') {
      this.addRoute('POST', path, args[0]);
      return;
    }
    return this.routes['POST'][path](...args);
  }

  public put(path: string, handler: (...args: number[]) => number): void;
  public put(path: string, ...args: number[]): number;
  public put(path: string, ...args: any[]): any {
    if (args.length === 1 && typeof args[0] === 'function') {
      this.addRoute('PUT', path, args[0]);
      return;
    }
    return this.routes['PUT'][path](...args);
  }

  public delete(path: string, handler: (...args: number[]) => number): void;
  public delete(path: string, ...args: number[]): number;
  public delete(path: string, ...args: any[]): any {
    if (args.length === 1 && typeof args[0] === 'function') {
      this.addRoute('DELETE', path, args[0]);
      return;
    }
    return this.routes['DELETE'][path](...args);
  }

  public patch(path: string, handler: (...args: number[]) => number): void;
  public patch(path: string, ...args: number[]): number;
  public patch(path: string, ...args: any[]): any {
    if (args.length === 1 && typeof args[0] === 'function') {
      this.addRoute('PATCH', path, args[0]);
      return;
    }
    return this.routes['PATCH'][path](...args);
  }
}

// Create a singleton instance
const mathUtils = new MathUtils();

// Export both the class and singleton instance
export default mathUtils;
