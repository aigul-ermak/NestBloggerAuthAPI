import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {appSettings} from './settings/app.setting';
import {applyAppSettings} from './settings/apply.app.setting';
import {ConfigService} from "@nestjs/config";
import {ConfigurationType} from "./settings/configuration";
import cookieParser from "cookie-parser";

// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    applyAppSettings(app);

    app.use(cookieParser());

    const configService = app.get(ConfigService<ConfigurationType, true>);

    const apiSettings = configService.get('apiSettings', {infer: true});
    const environmentSettings = configService.get('environmentSettings', {
        infer: true,
    });
    const port = apiSettings.PORT;

    await app.listen(appSettings.api.APP_PORT, () => {
        console.log('App starting listen port: ', appSettings.api.APP_PORT);
        console.log('ENV: ', environmentSettings.currentEnv);
    });
}

bootstrap();
