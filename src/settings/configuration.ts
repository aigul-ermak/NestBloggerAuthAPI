export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

export enum Environments {
    PRODUCTION = "PRODUCTION",
    STAGING = "STAGING",
    TEST = "TEST",
    DEVELOPMENT = "DEVELOPMENT",
}

const getConfig = (
    environmentVariables: EnvironmentVariable,
    currentEnvironment: Environments,
) => {
    return {
        apiSettings: {
            PORT: Number.parseInt(environmentVariables.PORT || '3000'),
            LOCAL_HOST: environmentVariables.LOCAL_HOST || 'http://localhost:3007',
            PUBLIC_FRIEND_FRONT_URL: environmentVariables.PUBLIC_FRIEND_FRONT_URL,
        },

        databaseSettings: {
            MONGO_CONNECTION_URI: environmentVariables.MONGO_CONNECTION_URI,
            MONGO_CONNECTION_URI_FOR_TESTS:
            environmentVariables.MONGO_CONNECTION_URI_FOR_TESTS,
        },

        environmentSettings: {
            currentEnv: currentEnvironment,
            isProduction: currentEnvironment === Environments.PRODUCTION,
            isStaging: currentEnvironment === Environments.STAGING,
            isTesting: currentEnvironment === Environments.TEST,
            isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
        },

        emailSettings: {
            EMAIL_USER: environmentVariables.EMAIL_USER,
            EMAIL_PASS: environmentVariables.EMAIL_PASS,
        },

        basicAuthSettings: {
            BASIC_AUTH_USERNAME: environmentVariables.HTTP_BASIC_USER,
            BASIC_AUTH_PASSWORD: environmentVariables.HTTP_BASIC_PASS,
        },
    };
};

export default () => {
    const environmentVariables = process.env;

    console.log('process.env.ENV =', environmentVariables.ENV);
    const currentEnvironment: Environments =
        environmentVariables.ENV as Environments;

    return getConfig(environmentVariables, currentEnvironment);
};