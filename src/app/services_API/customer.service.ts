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
    return this.http.get<ResponseModel>( this.configService.apiUrl + "/api/Customer/list-customer");
  }
  create(data: any)
  {
    return this.http.post<ResponseModel>( this.configService.apiUrl + "/api/Customer/create-customer", data);
  }
 SendOTP(email: string){
    return this.http.get<ResponseModel>(this.configService.apiUrl + "/api/customer/send-otp?email="+email);
 }
  update(data:any, idCustomer: any){
    return this.http.put<ResponseModel>(this.configService.apiUrl + "/api/Customer/update-customer?idCustomer="+idCustomer,data);
  }
  get(idCustomer: string){
    return this.http.get<ResponseModel>(this.configService.apiUrl + "/api/Customer/detail-customer?idCustomer="+idCustomer);
  }
}
