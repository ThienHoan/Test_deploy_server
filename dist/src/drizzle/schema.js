"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.User = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
