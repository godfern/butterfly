import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Put } from "@nestjs/common";
import { LanguageService } from "../component/language.service";
import { ApiUseTags } from "@nestjs/swagger";

@ApiUseTags('language')
@Controller('language')
export class LanguageController {
    constructor(@Inject('LanguageService') private langService: LanguageService) {
    }

    @Post('/create')
    async createLanguage(@Body() reqBody) {

        return await this.langService.createLanguage(reqBody);
    }

    @Get('/:langId')
    async getLanguage(@Param() params) {
        if (!params.langId) {
            throw new BadRequestException('lang id missing');
        }

        return await this.langService.getLanguage(params.langId);
    }

    @Put('/:langId')
    async updateLanguage(@Param() params, @Body() reqBody) {
        if (!params.langId) {
            throw new BadRequestException('lang id missing');
        }
        if (!reqBody) {
            throw new BadRequestException('lang body is missing');
        }

        return await this.langService.updateLanguage(reqBody);
    }

    @Delete('/:langId')
    async removeLanguage(@Param() params) {
        if (!params.langId) {
            throw new BadRequestException('lang id missing');
        }
        return await this.langService.removeLanguage(params.langId);
    }
}