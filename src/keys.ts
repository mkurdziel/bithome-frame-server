import {BindingKey} from '@loopback/context';
import {MediaService} from './services/media.service';
import {RestServer} from '@loopback/rest';

/**
 * Strongly-typed binding keys
 */
export const MEDIA_SERVICE = BindingKey.create<MediaService>(
    'services.MediaService',
);
export const KEY_REST_SERVER = BindingKey.create<RestServer>(
    'server.restServer',
);