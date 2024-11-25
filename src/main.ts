import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {appSettings} from './settings/app.setting';
import {applyAppSettings} from './settings/apply.app.setting';
import {ConfigService} from "@nestjs/config";
import {ConfigurationType} from "./settings/configuration";


async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    applyAppSettings(app);

    const configService = app.get<ConfigService<ConfigurationType>>(ConfigService);

    const apiSettings = configService.get('apiSettings');

    const port = apiSettings?.PORT || 3000;

    await app.listen(appSettings.api.APP_PORT, () => {
        console.log('App starting listen port: ', port);
        // console.log('ENV: ', apiSettings!.environmentSettings);
    });
}

bootstrap();

