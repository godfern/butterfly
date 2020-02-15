import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Put } from "@nestjs/common";
import { CategoryService } from "./model/category.service";
import { ApiUseTags } from "@nestjs/swagger";

@ApiUseTags('category')
@Controller('category')
export class CategoryContoller {

    constructor(@Inject('CategoryService') private categoryService: CategoryService) {

    }

    @Post('/create')
    async createCategory(@Body() reqBody) {
        return await this.categoryService.createCategory(reqBody);
    }

    @Put('/:categoryId')
    async updateCategory(@Param() params, @Body() category) {
        if (!params.categoryId) {
            throw new BadRequestException('category id missing')
        }
        return await this.categoryService.updateCategory(category);
    }

    @Get('/:categoryId')
    async getCategoryId(@Param() params) {
        if (!params.categoryId) {
            throw new BadRequestException('category id missing')
        }
        return await this.categoryService.getCategory(params.categoryId);
    }

    @Delete(':/categoryId')
    async removeCategoryId(@Param() params) {
        if (!params.categoryId) {
            throw new BadRequestException('category id missing')
        }
        return await this.categoryService.removeCategory(params.categoryId);
    }

}