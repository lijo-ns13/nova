import { Model, Document, PopulateOptions } from "mongoose";

import { injectable } from "inversify";
import { IBaseRepository } from "../../interfaces/repositories/IBaseRepository";

@injectable()
export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(entity: Partial<T>): Promise<T> {
    return this.model.create(entity);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async update(id: string, updateData: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async findAll(filter: Record<string, unknown> = {}): Promise<T[]> {
    return this.model.find(filter);
  }
  async findOne(
    filter: Record<string, unknown>,
    populate: Array<{ path: string; select?: string }> = [] // Optional populate array
  ): Promise<T | null> {
    return this.model.findOne(filter).populate(populate); // Populate related fields
  }
}
