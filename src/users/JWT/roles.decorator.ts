import { SetMetadata } from '@nestjs/common';

export const Roles = (...IdRol: string[]) => SetMetadata('IdRol', IdRol);