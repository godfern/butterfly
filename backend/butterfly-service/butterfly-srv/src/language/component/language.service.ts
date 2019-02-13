import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Language } from "../model/language.interface";

@Injectable()
export class LanguageService {

    constructor(@InjectModel('Language') private readonly languageModel: Model<Language>) {
    }

    async createLanguage(langModel: Language) {
        return await this.languageModel.create(langModel);
    }

    async updateLanguage(langModel: Language) {
        return await this.languageModel.findOneAndUpdate({ _id: langModel._id }, { langModel });
    }

    async getLanguage(langId) {
        return await this.languageModel.findById(langId);
    }

    async removeLanguage(langId) {
        return await this.languageModel.findByIdAndRemove({ _id: langId });
    }
}