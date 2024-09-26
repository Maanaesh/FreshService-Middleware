import express from "express";
import { getconfig } from "../controller/freshserviceController.js";
const router = express.Router();

router.get("/",getconfig);

export default router;