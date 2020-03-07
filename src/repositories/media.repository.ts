import {DefaultCrudRepository} from '@loopback/repository';
import {Media, MediaRelations} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MediaRepository extends DefaultCrudRepository<
  Media,
  typeof Media.prototype.id,
  MediaRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Media, dataSource);
  }
}
