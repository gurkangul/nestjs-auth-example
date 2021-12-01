import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { map, switchMap } from 'rxjs/operators';

export class ResourceService<
  T extends any,
  C extends object,
  U extends object,
> {
  constructor(protected readonly dbModel: Repository<T>) {}

  async create(model: C): Promise<any> {
    return await this.dbModel.save(model);
  }

  async findAll(): Promise<T[]> {
    return await this.dbModel.find();
  }

  async findOne(id: number): Promise<T> {
    return await this.dbModel.findOne(id);
  }

  async delete(id: number): Promise<any> {
    return await this.dbModel.delete(id);
  }

  async update(id: number, dto: U): Promise<any> {
    let user = await this.dbModel.findOneOrFail(id);
    if (user) {
      return this.dbModel.update(id, { ...dto });
    } else {
      console.error("Todo doesn't exist");
    }
  }
}
