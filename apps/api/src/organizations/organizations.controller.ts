import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard)
  async create(
    @Body() dto: CreateOrganizationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationsService.create(dto, req.user.userId);
  }

  @Get('check-slug')
  async checkSlug(@Query('slug') slug:string){
    const existing = await this.organizationsService.findBySlug(slug)
    return {available:!existing}
  }
}
