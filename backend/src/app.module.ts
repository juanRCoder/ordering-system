import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { SuppliesModule } from './features/supplies/supplies.module';
import { CategoriesModule } from './features/categories/categories.module';
import { OrdersModule } from './features/orders/orders.module';
import { AdminSuppliesModule } from './features/admin-supplies/admin-supplies.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    AuthModule,
    CategoriesModule,
    SuppliesModule,
    OrdersModule,
    AdminSuppliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
