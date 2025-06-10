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

  async findById(
    id: string,
    populate?: PopulateOptions | (string | PopulateOptions)[]
  ): Promise<T | null> {
    const query = this.model.findById(id);
    if (populate) {
      query.populate(populate);
    }
    return query.exec();
  }

  async update(id: string, updateData: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async findAll(
    filter: Record<string, unknown> = {},
    populate?: PopulateOptions | (string | PopulateOptions)[],
    sort?: Record<string, 1 | -1>,
    limit?: number
  ): Promise<T[]> {
    const query = this.model.find(filter);

    if (populate) {
      query.populate(populate);
    }

    if (sort) {
      query.sort(sort);
    }

    if (limit) {
      query.limit(limit);
    }

    return query.exec();
  }

  async findOne(
    filter: Record<string, unknown>,
    populate?: PopulateOptions | (string | PopulateOptions)[]
  ): Promise<T | null> {
    const query = this.model.findOne(filter);
    if (populate) {
      query.populate(populate);
    }
    return query.exec();
  }

  async findOneAndUpdate(
    filter: Record<string, any>,
    update: Partial<T>
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async countDocuments(filter: Record<string, unknown> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async paginate(
    filter: Record<string, unknown> = {},
    page: number = 1,
    limit: number = 10,
    populate?: PopulateOptions | (string | PopulateOptions)[],
    sort?: Record<string, 1 | -1>
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate(populate || [])
        .sort(sort || { createdAt: -1 })
        .exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
