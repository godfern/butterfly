import { Injectable, NestMiddleware, HttpStatus, MiddlewareFunction, Logger } from "@nestjs/common";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    logger = new Logger('LoggerMiddleware', true);
    resolve(...args: any[]): MiddlewareFunction {
        return (req, res, next) => {
            const oldWrite = res.write;
            const oldEnd = res.end;
            const chunks = [];
            res.write = (...restArgs) => {
                chunks.push(Buffer.from(restArgs[0]));
                oldWrite.apply(res, restArgs);
            };
            res.end = (...restArgs) => {
                if (restArgs[0]) {
                    chunks.push(Buffer.from(restArgs[0]));
                }
                // const body = Buffer.concat(chunks).toString('utf8');
                const logReponse: any = {
                    time: new Date().toUTCString(),
                    fromIP: req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress,
                    method: req.method,
                    query: req.query,
                    params: req.params,
                    headers: req.headers,
                    originalUrl: req.originalUrl,
                    url: req.url,
                    statusCode: res.statusCode,
                    message: HttpStatus[res.statusCode],
                    // referer: req.headers.referer || '',
                    // responseLength: Buffer.from(body).length,
                    // userAgent: req.headers['user-agent'],
                };
                if (req.method === 'POST' || req.method === 'PUT') {
                    logReponse.body = req.body;
                }
                this.logger.log(`ReqResponse middleware ${JSON.stringify(logReponse)}`);
                oldEnd.apply(res, restArgs);
            };
            next();
        };
    }


}