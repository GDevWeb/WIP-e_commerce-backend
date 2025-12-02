declare module "multer-storage-cloudinary" {
  import { ConfigOptions } from "cloudinary";
  import { StorageEngine } from "multer";

  /** @ types for multer-storage-cloudinary */
  interface Options {
    cloudinary: any;
    params?:
      | {
          folder?: string;
          format?: string | (() => string);
          public_id?: (req: any, file: any) => string;
          allowed_formats?: string[];
          transformation?: ConfigOptions | ConfigOptions[];
          [key: string]: any;
        }
      | (() => Promise<any>);
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: Options);
    _handleFile(req: any, file: any, cb: any): void;
    _removeFile(req: any, file: any, cb: any): void;
  }
}
