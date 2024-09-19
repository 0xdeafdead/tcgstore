import { JWTModuleConfig } from './jwt.types';
import { JWTService } from './jwt.service';

export const getJWTModuleCofig = (options: JWTModuleConfig): JWTService =>
  new JWTService(options);
