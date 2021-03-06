import {Model, model, property} from '@loopback/repository';

@model()
export class Container extends Model {

  constructor(data?: Partial<Container>) {
    super(data);
  }

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  container: string;

  @property({
    type: 'array',
  })
  files: File[];

  @property({
    type: 'number',
  })
  size?: number;

  @property({
    type: 'date',
  })
  atime?: string;

  @property({
    type: 'date',
  })
  mtime?: string;

  @property({
    type: 'date',
  })
  ctime?: string;


}

export interface ContainerRelations {
  // describe navigational properties here
}

export type ContainerWithRelations = Container & ContainerRelations;
