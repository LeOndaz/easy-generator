export class InvalidCredentialsError extends Error {
  code: string;
  constructor(message = 'Invalid credentials') {
    super(message);
    this.code = 'INVALID_CREDENTIALS';
  }
}

export class EmailAlreadyExistsError extends Error {
  code: string;
  constructor(message = 'Email already exists') {
    super(message);
    this.code = 'EMAIL_ALREADY_EXISTS';
  }
} 