import {Model, model, property} from '@loopback/repository';

@model()
export class ContainerFile extends Model {
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
    type: 'number',
  })
  size: number;

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


  constructor(data?: Partial<ContainerFile>) {
    super(data);
  }
}

export interface ContainerFileRelations {
  // describe navigational properties here
}

export type ContainerFileWithRelations = ContainerFile & ContainerFileRelations;
