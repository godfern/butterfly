import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LanguageService } from "../language/component/language.service";
import { LanguageController } from "../language/controller/language.controller";
import { LanguageSchema } from "../language/model/language.schema";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Language', schema: LanguageSchema }])],
    controllers: [LanguageController],
    providers: [LanguageService],
})
export class LanguageModule {
}