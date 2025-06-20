import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ApiDocsController } from './api_docs.controller';
import { ApiDocsService } from './api_docs.service';

@Module({
  controllers: [ApiDocsController],
  providers: [ApiDocsService],
})
export class ApiDocsModule {
  public static setup(app: INestApplication): OpenAPIObject {
    const apiDocsService = app.get(ApiDocsService);

    const config = new DocumentBuilder()
      .setTitle('EasyGenerator Task API')
      .setDescription('The EasyGenerator Task API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);

    apiDocsService.setDocument(document);

    return document;
  }
}
