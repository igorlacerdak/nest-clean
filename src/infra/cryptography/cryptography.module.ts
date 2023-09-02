import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter';
import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare';
import { BcryptHaser } from './bcrypt-hasher';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashCompare,
      useClass: BcryptHaser,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHaser,
    },
  ],

  exports: [Encrypter, HashCompare, HashGenerator],
})
export class CryptographyModule {}
