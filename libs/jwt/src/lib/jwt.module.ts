import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JWTModuleConfig } from './jwt.types';

import { JWT_MODULE_CONFIG } from './jwt.constants';
import { JWTService } from './jwt.service';

@Module({})
export class JWTModule {
  public static forRoot(options: JWTModuleConfig): DynamicModule {
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
