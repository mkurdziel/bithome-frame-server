import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {MEDIA_SERVICE} from '../keys';
import {MediaService} from '../services';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('media')
export class MediaObserver implements LifeCycleObserver {
  constructor(
      @inject(MEDIA_SERVICE) private mediaService: MediaService
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    await this.mediaService.start();
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    await this.mediaService.stop();
  }
}
