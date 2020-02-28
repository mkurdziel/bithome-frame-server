import {Model, model, property} from '@loopback/repository';

@model()
export class Container extends Model {

  constructor(data?: Partial<Container>) {
    super(data);
  }
}

export interface ContainerRelations {
  // describe navigational properties here
}

export type ContainerWithRelations = Container & ContainerRelations;
