import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Testlio API')
    .setDescription('API for managing issues and revisions with Domain-Driven Design')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT'
    )
    .addApiKey(
      { type: 'apiKey', name: 'X-Client-ID', in: 'header' },
      'X-Client-ID'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  console.log('Swagger Document:', JSON.stringify(document, null, 2)); // Debug log
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}