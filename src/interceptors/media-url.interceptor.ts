import {
    /* inject, */
    bind, inject,
    Interceptor,
    InvocationContext,
    InvocationResult,
    Provider,
    ValueOrPromise,
} from '@loopback/context';
import {Media} from '../models';
import {KEY_REST_SERVER} from '../keys';
import {RestServer} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({tags: {key: MediaUrlInterceptor.BINDING_KEY}})
export class MediaUrlInterceptor implements Provider<Interceptor> {
    static readonly BINDING_KEY = `interceptors.${MediaUrlInterceptor.name}`;

    constructor(@inject(KEY_REST_SERVER) private restServer: RestServer) {
    }

    /**
     * This method is used by LoopBack context to produce an interceptor function
     * for the binding.
     *
     * @returns An interceptor function
     */
    value() {
        return this.intercept.bind(this);
    }

    /**
     * The logic to intercept an invocation
     * @param invocationCtx - Invocation context
     * @param next - A function to invoke next interceptor or the target method
     */
    async intercept(
        invocationCtx: InvocationContext,
        next: () => ValueOrPromise<Media[]>,
    ) {
        try {
            // Add pre-invocation logic here
            const result = await next();

            // Add post-invocation logic here
            result.forEach((media: Media) => {
                if (media.container && media.file) {
                    media.url = this.restServer.url + '/download/' + media.container + '/' + media.file;
                }
            });

            return result;
        } catch (err) {
            // Add error handling logic here
            throw err;
        }
    }
}
