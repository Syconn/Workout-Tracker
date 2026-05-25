import type {JwtPayload} from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
    id: number;
    username: string;
}