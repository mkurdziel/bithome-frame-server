
export interface FileService {
  getContainers(cb?: Function): any;
  createContainer(options: any, cb?: Function): any;
  destroyContainer(container: any, cb?: Function): any;
  getContainer(container: any, cb?: Function): any;
  uploadStream(container: any, file: any, options: any, cb?: Function): any;
  downloadStream(container: any, file: any, options?: any, cb?: Function): any;
  getFiles(container: any, download?: any, cb?: Function): any;
  getFile(container: any, file: any, cb?: Function): any;
  removeFile(container: any, file: any, cb?: Function): any;
  upload(req: any, res: any, cb?: Function): any;
  download(container: any, file: any, req: any, res: any, cb?: Function): any;
}