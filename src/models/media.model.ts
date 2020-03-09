import {Entity, model, property} from '@loopback/repository';

@model()
export class Media extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  container: string;

  @property({
    type: 'string',
    required: true,
  })
  file: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: false,
  })
  title?: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'number',
  })
  latitude?: number;

  @property({
    type: 'number',
  })
  longitude?: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  keywords?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  persons?: string[];

  @property({
    type: 'string',
    required: true,
  })
  checksum: string;

  @property({
    type: 'date',
  })
  created?: string;


  constructor(data?: Partial<Media>) {
    super(data);
  }
}

export interface MediaRelations {
  // describe navigational properties here
}

export type MediaWithRelations = Media & MediaRelations;
