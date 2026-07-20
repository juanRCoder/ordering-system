import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { AdminGuard } from '../auth/auth.guard';
import { FileUploadInterceptor } from '../../common/interceptors/file-upload.interceptor';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';

@Controller('supplies')
export class SuppliesController {
  constructor(private suppliesService: SuppliesService) {}

  @Get('by-slug/:slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Query('categoryId') categoryId?: string,
    @Query('letters') letters?: string,
    @Query('page') page: number = 1
  ) {
    return this.suppliesService.findBySlug(slug, categoryId, letters, page);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.suppliesService.findById(id);
  }

  @UseGuards(AdminGuard)
  @Get()
  async findByAdminId(
    @CurrentAdmin() admin: { sub: string },
    @Query('categoryId') categoryId: string
  ) {
    return this.suppliesService.findByAdminId(admin.sub, categoryId);
  }

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileUploadInterceptor('image_url'))
  async create(
    @CurrentAdmin() admin: { sub: string },
    @Body() createSupplyDto: CreateSupplyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.suppliesService.create(createSupplyDto, admin.sub, file);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async updateStatus(
    @CurrentAdmin() admin: { sub: string },
    @Param('id') id: string
  ) {
    return this.suppliesService.updateStatus(id, admin.sub);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileUploadInterceptor('image_url'))
  async update(
    @CurrentAdmin() admin: { sub: string },
    @Param('id') id: string,
    @Body() updateSupplyDto: UpdateSupplyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.suppliesService.update(id, updateSupplyDto, file, admin.sub);
  }
}
