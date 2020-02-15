import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LanguageSchema } from "../language/model/language.schema";
import { CategoryContoller } from "./category.contoller";
import { CategorySchema } from "./model/category.schema";
import { CategoryService } from "./model/category.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }, { name: 'Language', schema: LanguageSchema }])],
    controllers: [CategoryContoller],
    providers: [CategoryService],
})
export class CategoryModule {
}