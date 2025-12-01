declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
      file?: Express.Multer.File;
    }
  }
}

export {};
