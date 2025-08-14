"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var index_1 = require("./index");
var node_postgres_1 = require("drizzle-orm/node-postgres");
var schema_1 = require("./drizzle/schema");
var Application = /** @class */ (function () {
    function Application() {
        this.app = new index_1.default();
        this.db = (0, node_postgres_1.drizzle)("postgres://postgres:%40Thien1411@localhost:5432/day4");
        this.initializeRoutes();
    }
    Application.prototype.initializeRoutes = function () {
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
    };
    // Helper method for math operations
    Application.prototype.mathOperation = function (operation) {
        return function (req, res) {
            var numbers = req.body;
            try {
                var result = operation.apply(void 0, numbers);
                res.json({
                    payload: result,
                    success: true,
                    message: "alright",
                    errorCode: null,
                });
            }
            catch (error) {
                res.json({
                    payload: null,
                    success: false,
                    message: "Operation failed",
                    errorCode: "ERROR",
                });
            }
        };
    };
    // Route handlers
    Application.prototype.getAllUsers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(schema_1.User)];
                    case 1:
                        users = _a.sent();
                        response = {
                            payload: users,
                            success: true,
                            message: "alright",
                            errorCode: null,
                        };
                        res.json(response);
                        return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.getUserById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = parseInt(req.params.id, 10);
                        if (isNaN(id)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Invalid ID",
                                    errorCode: "INVALID_ID",
                                })];
                        }
                        return [4 /*yield*/, this.db.select().from(schema_1.User).where((0, drizzle_orm_1.eq)(schema_1.User.id, id))];
                    case 1:
                        user = _a.sent();
                        if (user.length > 0) {
                            res.json({
                                payload: user[0],
                                success: true,
                                message: "alright",
                                errorCode: null,
                            });
                        }
                        else {
                            res.status(404).json({
                                success: false,
                                message: "User not found",
                                errorCode: "NOT_FOUND",
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.createUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name_1, email, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, name_1 = _a.name, email = _a.email;
                        return [4 /*yield*/, this.db
                                .insert(schema_1.User)
                                .values({ name: name_1, email: email })
                                .returning()];
                    case 1:
                        result = _b.sent();
                        res.json({
                            payload: result[0],
                            success: true,
                            message: "User created successfully",
                            errorCode: null,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.log(error_1);
                        res.status(400).json({
                            success: false,
                            message: "Failed to create user",
                            errorCode: "CREATE_ERROR",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.updateUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, name_2, email, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id, 10);
                        if (isNaN(id)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Invalid ID",
                                    errorCode: "INVALID_ID",
                                })];
                        }
                        _a = req.body, name_2 = _a.name, email = _a.email;
                        return [4 /*yield*/, this.db
                                .update(schema_1.User)
                                .set({ name: name_2, email: email })
                                .where((0, drizzle_orm_1.eq)(schema_1.User.id, id))
                                .returning()];
                    case 1:
                        result = _b.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: "User not found",
                                    errorCode: "NOT_FOUND",
                                })];
                        }
                        res.json({
                            payload: result[0],
                            success: true,
                            message: "User updated successfully",
                            errorCode: null,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        res.status(400).json({
                            success: false,
                            message: "Failed to update user",
                            errorCode: "UPDATE_ERROR",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.patchUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, updates, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id, 10);
                        if (isNaN(id)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Invalid ID",
                                    errorCode: "INVALID_ID",
                                })];
                        }
                        updates = req.body;
                        return [4 /*yield*/, this.db
                                .update(schema_1.User)
                                .set(updates)
                                .where((0, drizzle_orm_1.eq)(schema_1.User.id, id))
                                .returning()];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: "User not found",
                                    errorCode: "NOT_FOUND",
                                })];
                        }
                        res.json({
                            payload: result[0],
                            success: true,
                            message: "User patched successfully",
                            errorCode: null,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(400).json({
                            success: false,
                            message: "Failed to patch user",
                            errorCode: "PATCH_ERROR",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.deleteUser = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = parseInt(req.params.id, 10);
                        if (isNaN(id)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: "Invalid ID",
                                    errorCode: "INVALID_ID",
                                })];
                        }
                        return [4 /*yield*/, this.db
                                .delete(schema_1.User)
                                .where((0, drizzle_orm_1.eq)(schema_1.User.id, id))
                                .returning()];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: "User not found",
                                    errorCode: "NOT_FOUND",
                                })];
                        }
                        res.json({
                            payload: result[0],
                            success: true,
                            message: "User deleted successfully",
                            errorCode: null,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(400).json({
                            success: false,
                            message: "Failed to delete user",
                            errorCode: "DELETE_ERROR",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.testGet = function (req, res) {
        var query = req.query;
        console.log(query);
        try {
            if (query.success == 1) {
                var response = {
                    payload: "ok",
                    success: true,
                    message: "alright",
                    errorCode: null,
                };
                res.json(response);
            }
            else {
                var response = {
                    payload: null,
                    success: false,
                    message: "not ok",
                    errorCode: "1001",
                };
                res.json(response);
            }
        }
        catch (e) {
            console.log("no query string");
        }
    };
    Application.prototype.testPost = function (req, res) {
        console.log("oh ye");
        res.status(200).send("oh yes");
    };
    Application.prototype.start = function (port) {
        if (port === void 0) { port = 3000; }
        return this.app.run(port);
    };
    return Application;
}());
exports.Application = Application;
// Create default instance
var application = new Application();
exports.default = application;
