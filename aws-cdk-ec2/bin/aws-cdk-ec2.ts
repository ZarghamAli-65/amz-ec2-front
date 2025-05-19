#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyNextjsCdkStack } from '../lib/aws-cdk-ec2-stack';

const app = new cdk.App();

new MyNextjsCdkStack(app, 'MyNextjsCdkStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
