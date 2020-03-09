import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Media} from '../models';
import {MediaRepository} from '../repositories';

export class MediaController {
  constructor(
    @repository(MediaRepository)
    public mediaRepository : MediaRepository,
  ) {}

  @post('/media', {
    responses: {
      '200': {
        description: 'Media model instance',
        content: {'application/json': {schema: getModelSchemaRef(Media)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Media, {
            title: 'NewMedia',
            exclude: ['id'],
          }),
        },
      },
    })
    media: Omit<Media, 'id'>,
  ): Promise<Media> {
    return this.mediaRepository.create(media);
  }

  @get('/media/count', {
    responses: {
      '200': {
        description: 'Media model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Media) where?: Where<Media>,
  ): Promise<Count> {
    return this.mediaRepository.count(where);
  }

  @get('/media/random', {
    responses: {
      '200': {
        description: 'Random media selection',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  
  async random(): Promise<Media> {
    return this.mediaRepository.random();
  }

  @get('/media', {
    responses: {
      '200': {
        description: 'Array of Media model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Media, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Media) filter?: Filter<Media>,
  ): Promise<Media[]> {
    return this.mediaRepository.find(filter);
  }

  @patch('/media', {
    responses: {
      '200': {
        description: 'Media PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Media, {partial: true}),
        },
      },
    })
    media: Media,
    @param.where(Media) where?: Where<Media>,
  ): Promise<Count> {
    return this.mediaRepository.updateAll(media, where);
  }

  @get('/media/{id}', {
    responses: {
      '200': {
        description: 'Media model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Media, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Media, {exclude: 'where'}) filter?: FilterExcludingWhere<Media>
  ): Promise<Media> {
    return this.mediaRepository.findById(id, filter);
  }

  @patch('/media/{id}', {
    responses: {
      '204': {
        description: 'Media PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Media, {partial: true}),
        },
      },
    })
    media: Media,
  ): Promise<void> {
    await this.mediaRepository.updateById(id, media);
  }

  @put('/media/{id}', {
    responses: {
      '204': {
        description: 'Media PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() media: Media,
  ): Promise<void> {
    await this.mediaRepository.replaceById(id, media);
  }

  @del('/media/{id}', {
    responses: {
      '204': {
        description: 'Media DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.mediaRepository.deleteById(id);
  }
}
