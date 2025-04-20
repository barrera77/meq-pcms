import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Enable helmet middleware
  app.use(helmet.ieNoOpen());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
