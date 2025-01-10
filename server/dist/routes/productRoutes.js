"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
// Create a new router instance
const router = express_1.default.Router();
// Define routes with correct handler types
router.get("/", productController_1.getAllProducts); // TypeScript should infer the types correctly here
router.post("/", productController_1.createProduct);
exports.default = router;
