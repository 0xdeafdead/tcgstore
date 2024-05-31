import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ItemModule } from './items/item.module';

@Module({
  imports: [UserModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
