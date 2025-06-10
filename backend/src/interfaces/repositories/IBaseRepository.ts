import { Document, PopulateOptions } from "mongoose";

export interface IBaseRepository<T extends Document> {
  create(entity: Partial<T>): Promise<T>;
  findById(
    id: string,
    populate?: PopulateOptions | (string | PopulateOptions)[]
  ): Promise<T | null>;
  update(id: string, updateData: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findAll(
    filter?: Record<string, unknown>,
    populate?: PopulateOptions | (string | PopulateOptions)[],
    sort?: Record<string, 1 | -1>,
    limit?: number
  ): Promise<T[]>;
  findOne(
    filter: Record<string, unknown>,
    populate?: PopulateOptions | (string | PopulateOptions)[]
  ): Promise<T | null>;
  findOneAndUpdate(
    filter: Record<string, any>,
    update: Partial<T>
  ): Promise<T | null>;
  countDocuments(filter?: Record<string, unknown>): Promise<number>;
  paginate(
    filter?: Record<string, unknown>,
    page?: number,
    limit?: number,
    populate?: PopulateOptions | (string | PopulateOptions)[],
    sort?: Record<string, 1 | -1>
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
