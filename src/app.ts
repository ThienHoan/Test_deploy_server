import { eq } from "drizzle-orm";
import App from "./index";
import { drizzle } from "drizzle-orm/node-postgres";
import { User } from "./drizzle/schema";

interface ApiResponse<T> {
  payload?: T;
  success: boolean;
  message: string;
  errorCode?: string | null;
}

export class Application {
  private app: App;
  private db: any; // Replace 'any' with proper drizzle type

  constructor() {
    this.app = new App();
    this.db = drizzle("postgres://postgres:%40Thien1411@localhost:5432/day4");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // User routes
    this.app.get("/users", this.getAllUsers.bind(this));
    this.app.get("/users/:id", this.getUserById.bind(this));
    this.app.post("/users", this.createUser.bind(this));
    this.app.put("/users/:id", this.updateUser.bind(this));
    this.app.patch("/users/:id", this.patchUser.bind(this));
    this.app.del("/users/:id", this.deleteUser.bind(this));


    // Test routes
    this.app.get("/test", this.testGet.bind(this));
    this.app.post("/test", this.testPost.bind(this));
  }

  // Helper method for math operations
  private mathOperation(operation: (...args: number[]) => number) {
    return (req, res) => {
      const numbers = req.body;
      try {
        const result = operation(...numbers);
        res.json({
          payload: result,
          success: true,
          message: "alright",
          errorCode: null,
        });
      } catch (error) {
        res.json({
          payload: null,
          success: false,
          message: "Operation failed",
          errorCode: "ERROR",
        });
      }
    };
  }

  // Route handlers
  private async getAllUsers(req, res) {
    const users = await this.db.select().from(User);
    const response: ApiResponse<any[]> = {
      payload: users,
      success: true,
      message: "alright",
      errorCode: null,
    };
    res.json(response);
  }

  private async getUserById(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
        errorCode: "INVALID_ID",
      });
    }

    const user = await this.db.select().from(User).where(eq(User.id, id));

    if (user.length > 0) {
      res.json({
        payload: user[0],
        success: true,
        message: "alright",
        errorCode: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "NOT_FOUND",
      });
    }
  }

  private async createUser(req, res) {
    try {
      const { name, email } = req.body;
      const result = await this.db
        .insert(User)
        .values({ name: name, email: email })
        .returning();
      res.json({
        payload: result[0],
        success: true,
        message: "User created successfully",
        errorCode: null,
      });
    } catch (error) {
      console.log(error);

      res.status(400).json({
        success: false,
        message: "Failed to create user",
        errorCode: "CREATE_ERROR",
      });
    }
  }

  private async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID",
          errorCode: "INVALID_ID",
        });
      }

      const { name, email } = req.body;
      const result = await this.db
        .update(User)
        .set({ name, email })
        .where(eq(User.id, id))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          errorCode: "NOT_FOUND",
        });
      }

      res.json({
        payload: result[0],
        success: true,
        message: "User updated successfully",
        errorCode: null,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to update user",
        errorCode: "UPDATE_ERROR",
      });
    }
  }

  private async patchUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID",
          errorCode: "INVALID_ID",
        });
      }

      const updates = req.body;
      const result = await this.db
        .update(User)
        .set(updates)
        .where(eq(User.id, id))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          errorCode: "NOT_FOUND",
        });
      }

      res.json({
        payload: result[0],
        success: true,
        message: "User patched successfully",
        errorCode: null,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to patch user",
        errorCode: "PATCH_ERROR",
      });
    }
  }

  private async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID",
          errorCode: "INVALID_ID",
        });
      }

      const result = await this.db
        .delete(User)
        .where(eq(User.id, id))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          errorCode: "NOT_FOUND",
        });
      }

      res.json({
        payload: result[0],
        success: true,
        message: "User deleted successfully",
        errorCode: null,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to delete user",
        errorCode: "DELETE_ERROR",
      });
    }
  }

  private testGet(req, res) {
    const query = (req as any).query;
    console.log(query);

    try {
      if (query.success == 1) {
        const response: ApiResponse<string> = {
          payload: "ok",
          success: true,
          message: "alright",
          errorCode: null,
        };
        res.json(response);
      } else {
        const response: ApiResponse<string> = {
          payload: null,
          success: false,
          message: "not ok",
          errorCode: "1001",
        };
        res.json(response);
      }
    } catch (e) {
      console.log("no query string");
    }
  }

  private testPost(req, res) {
    console.log("oh ye");
    res.status(200).send("oh yes");
  }

  public start(port: number = 3000) {
    return this.app.run(port);
  }
}

// Create default instance
const application = new Application();

export default application;