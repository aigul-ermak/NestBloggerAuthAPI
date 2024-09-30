import {Module} from "@nestjs/common";
import {EmailService} from "./email.service";
import {EmailAdapter} from "./email-adapter.service";

@Module({
    providers: [EmailAdapter, EmailService],
    exports: [EmailService],
})
export class EmailModule {}