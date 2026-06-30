import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdminSuppliesService } from './admin-supplies.service';

@Controller('admin-supplies')
export class AdminSuppliesController {
  constructor(private adminSuppliesService: AdminSuppliesService) {}

  @Get(':slug')
  async findBySlug(
    @Param('slug') slug: string,
    @Query('categoryId') categoryId: string
  ) {
    return this.adminSuppliesService.findBySlug(slug, categoryId);
  }
}
