import { Controller, Get, Res } from '@nestjs/common';
import { ApiDocsService } from './api_docs.service';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class ApiDocsController {
  constructor(private readonly apiDocsService: ApiDocsService) {}

  @Get('swagger.yaml')
  getSwaggerYaml(@Res() res: Response) {
    const yamlDocument = this.apiDocsService.getYaml();
    res.type('text/yaml').send(yamlDocument);
  }
}
