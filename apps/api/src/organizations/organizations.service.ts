import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto, profileId: string) {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) throw new ConflictException('This slug is already taken');

    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          category: dto.category,
          logoUrl: dto.logoUrl,
          tagline: dto.tagline,
          brandColor: dto.brandColor,
          themeId: dto.themeId,
          contactPhone: dto.contactPhone,
          contactEmail: dto.contactEmail,
        },
      });

      await tx.deliveryZone.createMany({
        data: dto.governorates.map((governorate) => ({
          organizationId: organization.id,
          governorate,
        })),
      });

      await tx.membership.create({
        data: {
          organizationId: organization.id,
          profileId,
          role: 'owner',
        },
      });

      return organization
    });
  }
}
