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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var path_to_regexp_1 = require("path-to-regexp");
var App = /** @class */ (function () {
    function App() {
        this.routes = new Map();
    }
    App.prototype.createMyServer = function () {
        var _this = this;
        return (0, http_1.createServer)(function (req, res) { return _this.serverHandler(req, res); });
    };
    App.prototype.addRoute = function (method, path) {
        var handlers = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            handlers[_i - 2] = arguments[_i];
        }
        var key = "".concat(path, "/").concat(method);
        var existing = this.routes.get(key) || [];
        this.routes.set(key, __spreadArray(__spreadArray([], existing, true), handlers, true));
    };
    App.prototype.sanitizeUrl = function (url, method) {
        var urlParts = url.split("/");
        var cleanedParts = [];
        for (var i = 1; i < urlParts.length; i++) {
            var part = urlParts[i].split("?")[0];
            cleanedParts.push(part);
        }
        return "/".concat(cleanedParts.join("/"), "/").concat(method.toUpperCase());
    };
    App.prototype.matchUrl = function (sanitizedUrl) {
        for (var _i = 0, _a = Array.from(this.routes.keys()); _i < _a.length; _i++) {
            var path = _a[_i];
            var matcher = (0, path_to_regexp_1.match)(path, {
                decode: decodeURIComponent,
            });
            var result = matcher(sanitizedUrl);
            if (result) {
                return {
                    pathKey: path,
                    params: result.params,
                };
            }
        }
        return null;
    };
    App.prototype.serverHandler = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var resCustom, reqCustom, sanitized, matched, fullUrl, parsedUrl, queryParams, handlers, body, chunk, e_1_1, error_1, _i, handlers_1, handler;
            var _a, req_1, req_1_1;
            var _b, e_1, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        resCustom = res;
                        reqCustom = req;
                        resCustom.send = function (data) {
                            if (!res.headersSent) {
                                res.setHeader("Content-Type", "text/plain");
                            }
                            res.write(data);
                            res.end();
                        };
                        resCustom.json = function (data) {
                            if (!res.headersSent) {
                                res.setHeader("Content-Type", "application/json");
                            }
                            res.write(JSON.stringify(data));
                            res.end();
                        };
                        resCustom.status = function (code) {
                            res.statusCode = code;
                            return resCustom;
                        };
                        sanitized = this.sanitizeUrl(reqCustom.url || "", reqCustom.method || "");
                        matched = this.matchUrl(sanitized);
                        fullUrl = "http://localhost".concat(reqCustom.url);
                        parsedUrl = new URL(fullUrl);
                        queryParams = {};
                        parsedUrl.searchParams.forEach(function (value, key) {
                            queryParams[key] = value;
                        });
                        reqCustom.query = queryParams;
                        reqCustom.params = {};
                        reqCustom.body = {};
                        if (!matched) return [3 /*break*/, 21];
                        handlers = this.routes.get(matched.pathKey) || [];
                        reqCustom.params = matched.params;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 15, , 16]);
                        if (!(req.method !== "GET")) return [3 /*break*/, 14];
                        body = "";
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 8, 13]);
                        _a = true, req_1 = __asyncValues(req);
                        _e.label = 3;
                    case 3: return [4 /*yield*/, req_1.next()];
                    case 4:
                        if (!(req_1_1 = _e.sent(), _b = req_1_1.done, !_b)) return [3 /*break*/, 6];
                        _d = req_1_1.value;
                        _a = false;
                        chunk = _d;
                        body += chunk;
                        _e.label = 5;
                    case 5:
                        _a = true;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _e.trys.push([8, , 11, 12]);
                        if (!(!_a && !_b && (_c = req_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _c.call(req_1)];
                    case 9:
                        _e.sent();
                        _e.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13:
                        if (body) {
                            reqCustom.body = JSON.parse(body);
                        }
                        _e.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        error_1 = _e.sent();
                        console.error("Error parsing request body:", error_1);
                        return [3 /*break*/, 16];
                    case 16:
                        _i = 0, handlers_1 = handlers;
                        _e.label = 17;
                    case 17:
                        if (!(_i < handlers_1.length)) return [3 /*break*/, 20];
                        handler = handlers_1[_i];
                        return [4 /*yield*/, handler(reqCustom, resCustom)];
                    case 18:
                        _e.sent();
                        if (resCustom.writableEnded)
                            return [2 /*return*/];
                        _e.label = 19;
                    case 19:
                        _i++;
                        return [3 /*break*/, 17];
                    case 20:
                        if (!resCustom.writableEnded) {
                            resCustom.end();
                        }
                        return [3 /*break*/, 22];
                    case 21:
                        resCustom.statusCode = 404;
                        resCustom.end("Not found");
                        _e.label = 22;
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.run = function (port) {
        var server = this.createMyServer();
        server.listen(port, function () {
            console.log("Server is listening on port ".concat(port));
        });
    };
    App.prototype.get = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return this.addRoute.apply(this, __spreadArray(["GET", path], handlers, false));
    };
    App.prototype.post = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return this.addRoute.apply(this, __spreadArray(["POST", path], handlers, false));
    };
    App.prototype.put = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return this.addRoute.apply(this, __spreadArray(["PUT", path], handlers, false));
    };
    App.prototype.patch = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return this.addRoute.apply(this, __spreadArray(["PATCH", path], handlers, false));
    };
    App.prototype.del = function (path) {
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        return this.addRoute.apply(this, __spreadArray(["DELETE", path], handlers, false));
    };
    return App;
}());
exports.default = App;
