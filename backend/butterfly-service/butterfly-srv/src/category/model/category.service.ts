import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./category.interface";

@Injectable()
export class CategoryService {

    constructor(@InjectModel('Category') private readonly categoryModel: Model<Category>) {
    }

    async createCategory(category: Category) {
        return await this.categoryModel.create(category);
    }

    async getCategory(categoryId) {
        return await this.categoryModel.findById({ _id: categoryId });
    }

    async updateCategory(category: Category) {
        return await this.categoryModel.findByIdAndUpdate({ _id: category._id }, { category });
    }

    async removeCategory(categoryId) {
        return await this.categoryModel.findByIdAndRemove({ _id: categoryId });
    }
}