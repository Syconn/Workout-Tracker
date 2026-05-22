import jwt from "jsonwebtoken";

export function authenticate(req: any, res: any, next: any) {
    const token = req.cookies.token;

    if (!token) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!);
        next();
    } catch {
        return res.sendStatus(403);
    }
}