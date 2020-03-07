import {bind, /* inject, */ BindingScope, service} from '@loopback/core';
import {FileService} from './file.service';
import {inject} from '@loopback/context';
import {Container, ContainerFile} from '../models';
import debugFactory from 'debug';
import async, {ErrorCallback} from 'async';
import ExifReader from 'exifreader';

const debug = debugFactory('bithome:frame:media-service');


@bind({scope: BindingScope.SINGLETON})
export class MediaService {
    public static readonly MEDIA_TYPES: string[] = [
        'JPG',
        'JPEG',
    ];

    private timer: NodeJS.Timer;
    private refreshIntervalMs: number = 1 * 60 * 1000;



    constructor(@inject('file.provider') private fileService: FileService) {
    }

    /**
     * This method will be invoked when the application starts
     */
    async start(): Promise<void> {
        debug('Starting media service');


        debug('Refresh Interval: %d', this.refreshIntervalMs);

        await this.refresh();

        this.timer = setInterval(() => {
            this.refresh();
        }, this.refreshIntervalMs);
    }

    /**
     * This method will be invoked when the application stops
     */
    async stop(): Promise<void> {
        debug('Stopping media service');
        // /* istanbul ignore if */
        // if (this.timer) {
        //   clearInterval(this.timer);
        // }
        // await this.clear();
    }

    /**
     * Refresh the files from the disk into the database
     */
    refresh() {
        debug('Refreshing media...');

        this.fileService.getContainers().then((containers: Container[]) => {

            async.eachSeries(containers,
                (container: Container, callback) => {
                    this.refreshMediaContainer(container).then(() => {
                        callback();
                    });
                }, function (err) {
                    if (err) {
                        console.warn('Unable to get containers: ' + err);
                    } else {
                        debug('Refreshing media complete')
                    }
                });
        });
    }

    /**
     * Refresh a media container and the files in it
     * @param container
     */
    async refreshMediaContainer(container: Container) {
        debug('Refreshing container: %s', container.name);

        return new Promise((resolve) => {
            this.fileService.getFiles(container.name, false).then(
                (files: ContainerFile[]) => {
                    async.eachSeries(files, (file: ContainerFile, callback: ErrorCallback) => {
                        this.refreshMediaFile(file)
                            .then(() => {
                                callback(null);
                            })
                            .catch((err)=> {
                                callback(err);
                            });
                    }, (err) => {
                        if (err) {
                            console.warn('Unable to refresh media file: ' + err);
                        }
                        resolve();
                    });
                }
            );
        });
    }

    /**
     * Refresh a media file from a container
     * @param container
     */
    async refreshMediaFile(file: ContainerFile) {
        return new Promise((resolve) => {
            const extension = file.name.split('.').pop();

            if (!extension || !MediaService.MEDIA_TYPES.includes(extension.toUpperCase())) {
                debug('Ignoring media file: %s', file.name);
                resolve();
            } else {

                debug('Refreshing media file: %s', file.name);
                const fileStream = this.fileService.downloadStream(file.container, file.name);
                let chunks: Uint8Array[] = [];

                fileStream.once('end', () => {
                    const tags = ExifReader.load(Buffer.concat(chunks));
                    const lat = tags['GPSLatitude'];
                    const latRef = tags['GPSLatitudeRef'];
                    const lng = tags['GPSLongitude'];
                    const lngRef = tags['GPSLongitudeRef'];
                    if (lat && lng && latRef && lngRef) {
                        let latNum: number = parseFloat(lat.description);
                        let lngNum: number = parseFloat(lng.description);

                        if (latRef.value[0] ===  'S') {
                            latNum *= -1;
                        }
                        if (lngRef.value[0] ===  'W') {
                            lngNum *= -1;
                        }
                        debug('GPS:  %d,%d', latNum, lngNum);
                    }
                    resolve();
                });

                fileStream.on('data', (chunk: Uint8Array) => {
                    chunks.push(chunk);
                });

            }
        });
    }
}
