import {config} from 'dotenv';

config({path: '.env'});

export type EnvironmentVariable = { [key: string]: string | undefined };
//export type EnvironmentVariable = { [key: string]: string };
export type EnvironmentsTypes =
    | 'DEVELOPMENT'
    | 'STAGING'
    | 'PRODUCTION'
    | 'TESTING';
export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING'];

export class EnvironmentSettings {
    constructor(private env: EnvironmentsTypes) {
    }

    getEnv() {
        return this.env;
    }

    isProduction() {
        return this.env === 'PRODUCTION';
    }

    isStaging() {
        return this.env === 'STAGING';
    }

    isDevelopment() {
        return this.env === 'DEVELOPMENT';
    }

    isTesting() {
        return this.env === 'TESTING';
    }
}

class AppSettings {
    constructor(
        public env: EnvironmentSettings,
        public api: APISettings,
    ) {
    }
}

class APISettings {
    // Application
    public readonly APP_PORT: number;

    // Database
    public readonly MONGO_CONNECTION_URI: string;

    public readonly MONGO_CONNECTION_URI_FOR_TESTS: string;

    public readonly MONGO_DBName: string;

    public readonly TEST_DBName: string;

    constructor(private readonly envVariables: EnvironmentVariable) {
        // Application
        this.APP_PORT = this.getNumberOrDefault(envVariables.APP_PORT, 7840);

        this.MONGO_DBName =
            envVariables.MONGO_DBName ?? 'db';

        // Database
        this.MONGO_CONNECTION_URI =
            envVariables.MONGO_CONNECTION_URI ?? 'mongodb://localhost/nest';

        this.MONGO_CONNECTION_URI_FOR_TESTS =
            envVariables.MONGO_CONNECTION_URI_FOR_TESTS ?? 'mongodb://localhost';

        this.MONGO_DBName =
            envVariables.MONGO_DBName ?? 'home-works-db';

        this.TEST_DBName =
            envVariables.TEST_DBName ?? 'test-db';


    }

    private getNumberOrDefault(value: any, defaultValue: number): number {
        const parsedValue = Number(value);

        if (isNaN(parsedValue)) {
            return defaultValue;
        }

        return parsedValue;
    }
}


const env = new EnvironmentSettings(
    (Environments.includes(process.env.ENV?.trim() as string)
        ? process.env.ENV?.trim()
        : 'DEVELOPMENT') as EnvironmentsTypes,
);

const api = new APISettings(process.env);
export const appSettings = new AppSettings(env, api);

// const env = new EnvironmentSettings(
//   ((Environments as EnvironmentsTypes[]).includes(process.env.ENV?.trim() as EnvironmentsTypes)
//     ? process.env.ENV.trim()
//     : 'DEVELOPMENT') as EnvironmentsTypes,
// );
//
//
// //
// const api = new APISettings(process.env!);
// export const appSettings = new AppSettings(env, api);
