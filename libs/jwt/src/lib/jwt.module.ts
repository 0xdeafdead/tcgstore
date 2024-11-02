import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { JWTModuleConfig } from './jwt.types';

import { JWT_MODULE_CONFIG } from './jwt.constants';
import { JWTService } from './jwt.service';

@Module({})
@Global()
export class JWTModule {
  public static forRootAsync(options: JWTModuleConfig): DynamicModule {
    return {
      module: JWTModule,
      providers: [
        {
          provide: JWT_MODULE_CONFIG,
          useValue: options,
        },
        JWTService,
      ],
      exports: [JWTService],
    };
  }
}
