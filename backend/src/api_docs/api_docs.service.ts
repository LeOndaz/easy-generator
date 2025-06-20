import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import * as yaml from 'js-yaml';

@Injectable()
export class ApiDocsService {
  private document: OpenAPIObject;

  setDocument(document: OpenAPIObject) {
    this.document = document;
  }

  getDocument(): OpenAPIObject {
    if (!this.document) {
      throw new NotFoundException('OpenAPI document not found');
    }
    return this.document;
  }

  getYaml(): string {
    const document = this.getDocument();
    return yaml.dump(document);
  }
}
