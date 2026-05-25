import { JwtPayload } from "jsonwebtoken";
import type {UserPayload} from "../middleware/UserPayload.js";

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}