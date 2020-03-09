import {bind, /* inject, */ BindingScope, service} from '@loopback/core';
import {FileService} from './file.service';
import {inject} from '@loopback/context';
import {Container, ContainerFile, Media} from '../models';
import debugFactory from 'debug';
import async, {ErrorCallback} from 'async';
import ExifReader, {NumberArrayTag} from 'exifreader';
import {repository} from '@loopback/repository';
import {MediaRepository} from '../repositories';
import * as crypto from 'crypto';


const debug = debugFactory('bithome:frame:media-service');


@bind({scope: BindingScope.SINGLETON})
export class MediaService {
    public static readonly MEDIA_TYPES: string[] = [
        'JPG',
        'JPEG',
    ];

    private timer: NodeJS.Timer;
    private refreshIntervalMs: number = 1 * 60 * 1000;

    constructor(@inject('file.provider') private fileService: FileService,
                @repository(MediaRepository) public mediaRepository: MediaRepository) {
    }

    /**
     * This method will be invoked when the application starts
     */
    async start(): Promise<void> {
        debug('Starting media service');


        debug('Refresh Interval: %d', this.refreshIntervalMs);

        await this.clearData();

        await this.refresh();

        // this.timer = setInterval(() => {
        //     this.refresh();
        // }, this.refreshIntervalMs);
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

    async clearData() {
        debug('Clearing media repository...');

        await this.mediaRepository.deleteAll();
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
                let hash = crypto.createHash('md5');

                fileStream.once('end', () => {
                    const media = new Media();
                    media.type = 'image';
                    media.file = file.name;
                    media.container = file.container;
                    media.checksum = hash.digest('hex');

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
                        media.latitude = latNum;
                        media.longitude = lngNum;
                    }

                    const keywords: NumberArrayTag = tags['Keywords'];
                    if (keywords) {
                        media.keywords = [];
                        if (Array.isArray(keywords)) {
                            const keywordsArray: NumberArrayTag[] = keywords as NumberArrayTag[];
                            keywordsArray.forEach((keyword: NumberArrayTag) => {
                                debug(keyword.description);
                                media.keywords?.push(keyword.description);
                            });
                        } else {
                            debug(keywords.description);
                            media.keywords?.push(keywords.description);
                        }
                    }

                    // Create the media entry
                    this.mediaRepository.create(media).then((result: any) => {
                        debug('%s created successfully', media.file);
                        resolve();
                    }).catch((reason: any) => {
                        debug('ERROR: %s not created: %s', media.file, reason);
                        resolve(reason);
                    });

                });

                fileStream.on('data', (chunk: any) => {
                    hash.update(chunk, 'utf8');
                    chunks.push(chunk);
                });

            }
        });
    }
}
