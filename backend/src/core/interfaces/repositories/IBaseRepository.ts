import { Document } from "mongoose";

export interface IBaseRepository<T extends Document> {
  create(entity: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, updateData: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findAll(filter?: Record<string, unknown>): Promise<T[]>;
}
