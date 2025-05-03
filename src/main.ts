import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    setupSwagger(app);
    await app.listen(8080);
    logger.log('Application is running on http://localhost:8080');
    logger.log('Swagger UI available at http://localhost:8080/api-docs');
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}
bootstrap();