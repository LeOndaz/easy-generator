import { IsEnum, IsInt, IsString, IsUrl } from 'class-validator';

// This enum can be expanded with other environments like 'production', 'staging', etc.
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsInt()
  PORT: number;

  @IsUrl({
    require_protocol: false,
    require_tld: false,
    require_valid_protocol: false,
  })
  MONGODB_URI: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;
}
