import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule } from 'src/config/databases/db.module';
import { DatabaseConfigService } from 'src/config/databases/dbConfig.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfigService],
      imports: [DatabaseConfigModule],
      useFactory: (configService: DatabaseConfigService) => {
        return configService.connections;
      },
    }),
  ],
  providers: [ConfigService, DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule {}
