import {bind, /* inject, */ BindingScope, service} from '@loopback/core';
import {FileService} from './file.service';
import {inject} from '@loopback/context';
import {Container} from '../models';
import debugFactory from 'debug';
const debug = debugFactory('bithome:frame:media');


@bind({scope: BindingScope.SINGLETON})
export class MediaService {
  private timer: NodeJS.Timer;
  private refreshIntervalMs: number = 10 * 60 * 1000;

  constructor(@inject('file.provider') private fileService: FileService) {
  }

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    debug('Starting media service');

    // this.fileService.getContainers().then((containers: Container[]) => {
    //   console.log(containers);
    // });
    debug('Refresh Interval: %d', this.refreshIntervalMs);

    await this.refresh();

    this.timer = setInterval(() => {
      this.refresh().catch(console.warn);
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
  async refresh() {
    debug('Refreshing media...');
    // for (const key of this.store.keys()) {
    //   if (await this.isExpired(key)) {
    //     debug('Cache for %s is swept.', key);
    //     await this.delete(key);
    //   }
    // }
  }
}
