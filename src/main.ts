import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins in development
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3001);

  // Seed admin user
  const usersService = app.get(UsersService);
  await usersService.seedAdminUser();

  await app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
  });
}

bootstrap();

