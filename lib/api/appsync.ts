import { Construct } from 'constructs'
import * as awsAppsync from 'aws-cdk-lib/aws-appsync'
import * as path from 'path'
import { UserPool } from 'aws-cdk-lib/aws-cognito'
import { IRole } from 'aws-cdk-lib/aws-iam'
import { Function } from 'aws-cdk-lib/aws-lambda'

type AppSyncAPIProps = {
	unauthenticatedRole: IRole
	userpool: UserPool
	lambdaFunction: Function
}

export function createAPI(scope: Construct, props: AppSyncAPIProps) {
	const api = new awsAppsync.GraphqlApi(scope, 'peterAPI', {
		name: `peterAPI`,
		schema: awsAppsync.SchemaFile.fromAsset(
			path.join(__dirname, './schema.graphql')
		),
		authorizationConfig: {
			defaultAuthorization: {
				authorizationType: awsAppsync.AuthorizationType.USER_POOL,
				userPoolConfig: {
					userPool: props.userpool,
				},
			},
		},
		logConfig: {
			fieldLogLevel: awsAppsync.FieldLogLevel.ALL,
		},
	})
	const lambdaDataSource = api.addLambdaDataSource(
		'MyLambdaDataSource',
		props.lambdaFunction
	)

	api.createResolver('peterResolver', {
		typeName: 'Query',
		fieldName: 'getName',
		dataSource: lambdaDataSource,
	})

	return api
}
