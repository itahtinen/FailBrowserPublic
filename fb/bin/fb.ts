#!/usr/bin/env node

import * as cdk from "@aws-cdk/core";
import { FbStack } from "../lib/fb-stack";
import { Environment } from "@aws-cdk/core";

const envEU: Environment = { account: "", region: "eu-west-1" };

const app = new cdk.App();
new FbStack(app, "FailbrowserStack", {
  env: envEU,
});
