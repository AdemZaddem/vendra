import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'supabase' })],
  providers: [AuthService, SupabaseStrategy],
  exports: [PassportModule, SupabaseStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
