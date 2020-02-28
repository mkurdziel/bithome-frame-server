import {getService, juggler} from '@loopback/service-proxy';
import {bind, inject, BindingScope, Provider} from '@loopback/core';
import {FilesystemDataSource} from '../datasources/filesystem.datasource';
import {FileService} from './file.service';

@bind({scope: BindingScope.TRANSIENT})
export class FileServiceProvider implements Provider<FileService> {
    constructor(
        @inject('datasources.filesystem')
        protected dataSource: juggler.DataSource = new FilesystemDataSource()) {
    }

    value() : Promise<FileService> {
        return getService(this.dataSource);
    }
}
