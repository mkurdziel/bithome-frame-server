import {DefaultCrudRepository} from '@loopback/repository';
import {Media, MediaRelations} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MediaRepository extends DefaultCrudRepository<Media,
    typeof Media.prototype.id,
    MediaRelations> {
    constructor(
        @inject('datasources.mongodb') dataSource: MongodbDataSource,
    ) {
        super(Media, dataSource);
    }

    async random(): Promise<Media> {
        const mediaCollection = (this.dataSource.connector as any).collection("Media");

        return new Promise<Media>((resolve, reject) => {
            mediaCollection
                .aggregate([
                    {$sample: {size: 1}}
                ]).get((err: any, result: Media[]) => {

                if (result) {
                    resolve(result[0]);
                } else {
                    resolve();
                }
            });
        });

    }
}
