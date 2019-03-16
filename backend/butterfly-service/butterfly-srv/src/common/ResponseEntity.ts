
export class ResponseEntity{

    constructor(success:boolean,statusCode:number,error:any,data:any){
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.error = error;
    }
    
    success:boolean;
    statusCode: number;
    error: any;
    data:any;

}