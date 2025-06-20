import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ApiDocsController } from './api_docs.controller';
import { ApiDocsService } from './api_docs.service';
import { AuthModule } from '../auth/auth.module';
import { AppModule } from 'src/app.module';

@Module({
  controllers: [ApiDocsController],
  providers: [ApiDocsService],
  imports: [AuthModule],
})
export class ApiDocsModule {
  public static setup(app: INestApplication): OpenAPIObject {
    const options = new DocumentBuilder()
      .setTitle('EasyGenerator Task API')
      .setDescription('The EasyGenerator Task API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options, {
      include: [AppModule, AuthModule],
    });

    const apiDocsService = app.get(ApiDocsService);
    apiDocsService.setDocument(document);

    return document;
  }
}
