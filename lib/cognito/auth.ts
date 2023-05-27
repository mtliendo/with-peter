import { Construct } from 'constructs'
import * as awsCognito from 'aws-cdk-lib/aws-cognito'
import {
	IdentityPool,
	UserPoolAuthenticationProvider,
} from '@aws-cdk/aws-cognito-identitypool-alpha'

type CreateAuth = {}

export function createAuth(scope: Construct, props: CreateAuth) {
	const userPool = new awsCognito.UserPool(scope, `peter-userpool`, {
		userPoolName: `peter-userpool`,
		selfSignUpEnabled: true,
		accountRecovery: awsCognito.AccountRecovery.PHONE_AND_EMAIL,
		userVerification: {
			emailStyle: awsCognito.VerificationEmailStyle.CODE,
		},
		autoVerify: {
			email: true,
		},
		standardAttributes: {
			email: {
				required: true,
				mutable: true,
			},
		},
	})

	const userPoolClient = new awsCognito.UserPoolClient(
		scope,
		`peter-userpoolClient`,
		{ userPool }
	)

	const identityPool = new IdentityPool(scope, `peter-identityPool`, {
		identityPoolName: `peter-IdentityPool`,
		allowUnauthenticatedIdentities: true,
		authenticationProviders: {
			userPools: [
				new UserPoolAuthenticationProvider({
					userPool: userPool,
					userPoolClient: userPoolClient,
				}),
			],
		},
	})

	return { userPool, userPoolClient, identityPool }
}
