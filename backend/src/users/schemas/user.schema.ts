import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id?: string;

  @ApiProperty({
    description: "The user's unique email",
    example: 'johndoe@example.com',
  })
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @ApiProperty({
    description: "The user's password",
    example: 'password123',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty()
  @Prop({ type: Date })
  createdAt?: Date;

  @ApiProperty()
  @Prop({ type: Date })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); 