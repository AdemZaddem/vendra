import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './guards/supabase-auth/supabase-auth.guard';
import { AuthService } from './auth.service';
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user.userId) {
      throw new Error('User is not authenticated');
    }
    return this.authService.getMembershipStatus(req.user.userId);
  }
}
