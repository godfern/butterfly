import { Logger } from "@nestjs/common";

export class MyLogger extends Logger {
    constructor(context: string, isTimeDiffEnabled?: boolean) {
        super(context, isTimeDiffEnabled);
        console.log('Logger init');
    }
    log(message: string) {
        console.log('message', message);
        super.log(message);
    }
    error(message: string, trace: string) {
        super.error(message, trace);
    }
    warn(message: string) {
        super.warn(message);
    }

} 