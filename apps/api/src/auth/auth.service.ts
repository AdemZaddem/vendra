import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async getMembershipStatus(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const memberships = await this.prisma.membership.findMany({
      where: { profileId: userId },
      include: { organization: true },
    });

    return {
        memberships:memberships.map((m)=>({
            organizationId:m.organizationId,
            organizationName:m.organization.name,
            organizationSlug:m.organization.slug,
            role:m.role,
        }))
    }
  }
}
