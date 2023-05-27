import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createAuth } from './cognito/auth'
import { createAPI } from './api/appsync'
import { createFunc } from './functions/construct'

export class WithPeterStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)

		const peterFunc = createFunc(this, {})
		const auth = createAuth(this, {})
		const api = createAPI(this, {
			userpool: auth.userPool,
			unauthenticatedRole: auth.identityPool.unauthenticatedRole,
			lambdaFunction: peterFunc,
		})
	}
}
