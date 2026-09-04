import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './guards/supabase-auth/supabase-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
