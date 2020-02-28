import { FileService } from "../services/file.service";

// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { post, requestBody, get, ResponseObject, param } from "@loopback/rest";

const POST_RESPONSE: ResponseObject = {
  description: 'Post Container',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        }
      }
    }
  }
}

export class ContainerController {
  constructor(
      @inject('file.provider') private fileService: FileService
  ) { }


  @get('/container')
  async getAllContainers() {
    return this.fileService.getContainers();
  }
}
