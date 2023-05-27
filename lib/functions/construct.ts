import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import path = require('path')

export function createFunc(scope: Construct, props: {}) {
	return new NodejsFunction(scope, 'withPeterFunc', {
		functionName: `withPeterFunc`,
		runtime: Runtime.NODEJS_16_X,
		handler: 'handler',
		entry: path.join(__dirname, `./main.ts`),
	})
}
