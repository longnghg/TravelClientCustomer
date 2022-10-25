import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { ResponseModel } from "../models/responsiveModels/response.model";

@Injectable({
    providedIn: 'root'
})

export class CustomerService{
  constructor(private http:HttpClient, private configService:ConfigService){ }

  gets()
  {
    return this.http.get<ResponseModel>( this.configService.apiUrl + "/api/Customer/gets-customer");
  }
  create(data: any)
  {
    return this.http.post<ResponseModel>( this.configService.apiUrl + "/api/Customer/create-customer", data);
  }
 SendOTP(email: string){
    return this.http.get<ResponseModel>(this.configService.apiUrl + "/api/customer/send-otp?email="+email);
 }
  update(data:any){
    return this.http.post<ResponseModel>(this.configService.apiUrl + "/api/Customer/update-customer",data);
  }
  get(idCustomer: string){
    return this.http.get<ResponseModel>(this.configService.apiUrl + "/api/Customer/get-customer?idCustomer="+idCustomer);
  }
}
