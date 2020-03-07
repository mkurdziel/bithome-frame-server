import {BindingKey} from '@loopback/context';
import {MediaService} from './services/media.service';

/**
 * Strongly-typed binding keys
 */
export const MEDIA_SERVICE = BindingKey.create<MediaService>(
    'services.MediaService',
);