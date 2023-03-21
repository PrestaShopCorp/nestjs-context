/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ClsModule } from 'nestjs-cls';
import { ContextModule } from '../../../context.module';
import { ContextName } from '../../../interfaces';
import { AsyncRequestServiceExposer } from '../exposers/async-request-service-exposer.mock';
import { ContextContainerExposer } from '../exposers/context-container-exposer.mock';
import { TestController } from './test-controller.mock';
import { TestService } from './test-service.mock';
import { TestResolver } from './test-resolver.mock';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        setup: (cls, request) => {
          cls.set('testValue', request.headers['x-test-value']);
        },
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    ContextModule.register({
      build: {
        testValue: ['req.headers.x-test-value'],
      },
      type: ContextName.HTTP,
    }),
  ],
  controllers: [TestController],
  providers: [
    ContextContainerExposer,
    AsyncRequestServiceExposer,
    TestResolver,
    TestService,
  ],
})
export class TestModule {}
