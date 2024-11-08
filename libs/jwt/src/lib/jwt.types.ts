export interface JWTModuleConfig {
  secret: string;
  issuer: string;
  audience: string[];
}
