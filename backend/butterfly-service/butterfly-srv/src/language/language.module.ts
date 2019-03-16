import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LanguageService } from "src/language/component/language.service";
import { LanguageController } from "src/language/controller/language.controller";
import { LanguageSchema } from "src/language/model/language.schema";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Language', schema: LanguageSchema }])],
    controllers: [LanguageController],
    providers: [LanguageService],
})
export class LanguageModule {
}