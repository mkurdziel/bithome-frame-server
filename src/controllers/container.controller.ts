import {FileService} from "../services/file.service";

// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';
import {post, requestBody, get, ResponseObject, param} from "@loopback/rest";

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
    constructor(@inject('file.provider') private fileService: FileService) {
    }

    @get('/container/{container}/files/{file}')
    async getFile(@param.path.string('container') containerName: String,
                  @param.path.string('file') fileName: String) {
        return this.fileService.getFile(containerName, fileName);
    }

    @get('/container/{container}/files')
    async getAllContainerFiles(@param.path.string('container') containerName: String) {
        return this.fileService.getFiles(containerName, false);
    }

    @get('/container')
    async getAllContainers() {
        return this.fileService.getContainers();
    }

    @get('/download/{container}/{file}')
    async downloadFile(@param.path.string('container') containerName: String,
                       @param.path.string('file') fileName: String) {
        return this.fileService.downloadStream(containerName, fileName);
    }

}
