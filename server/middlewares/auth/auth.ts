import jwt, { Secret } from "jsonwebtoken";
import Express from 'express';
import Admin from "../../models/admin.models";

const requireAdminAuth = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = tokenHeader.split(" ")[1];
    const SECRET = process.env.SECRET;
    if (!SECRET) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const decoded = jwt.verify(token, SECRET as Secret);

    const admin = await Admin.findById((decoded as any).id);

    if (admin) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default requireAdminAuth;
