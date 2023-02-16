// lib/middleware.ts

import { Auth } from "./auth";

export const withAuth = (handler: any) => {
  return async (req: any, res: any) => {
    try {
      const user = await Auth.getCurrentUser();
      if (user) {
        // Redirect user to home page if they are authenticated
        if (req.url === "/login") {
          res.writeHead(302, {
            Location: "/",
          });
          res.end();
        } else {
          req.user = user;
          return handler(req, res);
        }
      } else {
        // Redirect user to login page if they are not authenticated
        res.writeHead(302, {
          Location: "/login",
        });
        res.end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
