import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { AdminGuard } from '../auth/auth.guard';
import { FileUploadInterceptor } from '../../common/interceptors/file-upload.interceptor';

@Controller('supplies')
export class SuppliesController {
  constructor(private suppliesService: SuppliesService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.suppliesService.findById(id);
  }

  @Get('category/:id')
  async findByCategoryId(@Param('id') id: string) {
    return this.suppliesService.findByCategoryId(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileUploadInterceptor('image'))
  async create(
    @Body() createSupplyDto: CreateSupplyDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.suppliesService.create(createSupplyDto, file);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string) {
    return this.suppliesService.updateStatus(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplyDto: UpdateSupplyDto
  ) {
    return this.suppliesService.update(id, updateSupplyDto);
  }
}
