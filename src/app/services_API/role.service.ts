import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { ResponseModel } from "../models/responsiveModels/response.model";
import { RoleModel } from "../models/role.model";
import { NotificationService } from "../services_API/notification.service";

@Injectable({
    providedIn: 'root'
})

export class RoleService{
  constructor(private http:HttpClient, private configService:ConfigService, private notificationService: NotificationService){ }
  response: ResponseModel
  resRole: RoleModel[]
  async views()
  {
    var value = <any>await new Promise<any>(resolve => {
      this.http.get<ResponseModel>( this.configService.apiUrl + "/api/Role/list-role").subscribe(res => {
        this.response = res
        this.resRole =  this.response.content
          resolve(this.resRole);
    }, error => {
      var message = this.configService.error(error.status, error.error != null?error.error.text:"");
      this.notificationService.handleAlert(message, "Error")
    })})
    return value

  }
  gets()
  {
      return this.http.get<ResponseModel>( this.configService.apiUrl + "/api/Role/list-role");
  }
  search(data: any)
  {
    return this.http.post<ResponseModel>( this.configService.apiUrl + "/api/Role/search-role", data);
  }

  create(data: any)
  {
    return this.http.post<ResponseModel>( this.configService.apiUrl + "/api/Role/create-role", data);
  }

  update(data: any)
  {
    return this.http.post<ResponseModel>( this.configService.apiUrl + "/api/Role/update-role", data);
  }

  restore(data: any)
  {
    return this.http.post<ResponseModel>( this.configService.apiUrl + "/api/Role/restore-role", data);
  }
  delete(data: any){
    return this.http.post<ResponseModel>( this.configService.apiUrl + "/api/Role/delete-role", data);
  }
}
