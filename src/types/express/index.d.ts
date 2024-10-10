import { Doc } from "../../models/docs.model";
import { User } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: User;
      doc: Doc;
    }
  }
}