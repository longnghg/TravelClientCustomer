import { Injectable, Inject, PipeTransform, Pipe } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { AuthenticationService } from "../services_API/authentication.service";
import { ResponseModel } from "../models/responsiveModels/response.model";
import { AuthenticationModel } from "../models/authentication.model";
@Injectable({
  providedIn: 'root'
})
export class ConfigService{
  constructor(@Inject(DOCUMENT) private document: Document){}
  authenticationService: AuthenticationService
  private hubConnectionBuilder: HubConnection
  public apiUrl = "https://gatewayapitravelrover.azurewebsites.net";
  public apiTourBookingUrl = "https://gatewayapitravelrover.azurewebsites.net";
  public apiUrlSignR = "https://rovermanagerservice.azurewebsites.net";
  public clientUrl = this.document.location.origin
  response: ResponseModel
  auth: AuthenticationModel
  signalR(){
    var token = localStorage.getItem("token")
    if (!token) {
      token = JSON.parse(localStorage.getItem("authGuest")).token
    }
    return this.hubConnectionBuilder = new HubConnectionBuilder()
   .configureLogging(LogLevel.Information).withUrl(`${this.apiUrlSignR}/travelhub`,
   {
       accessTokenFactory: () => token

   })
   .withAutomaticReconnect()
   .build();
  }

  callChatSignalR(id:string): void{
   this.hubConnectionBuilder.invoke('Chat',id)
  }
  callNotyfSignalR(roleId:string): void{
    this.hubConnectionBuilder.invoke('SendNotyf',roleId)
  }
  callBlockSignalR(id:string): void{
    this.hubConnectionBuilder.invoke('Block',id)
  }
  error(status: any, message: any){
    console.log('Status:  '  + status);
    console.log('Message: '  + message);

    if (status == 401){
      var input={
        email: "default@gmail.com",
        password: "123"
      }
      this.authenticationService.loginDefault(input).then(res => {
        this.response = res
        this.auth = this.response.content
        localStorage.setItem("tokenDefault", this.auth.token)
      });
    }
    else if (status == 200) {
        message = message;
    }
    else{
        message = "Kh??ng k???t n???i ???????c ?????n server !"
    }

    return message
  }

  listGender(){
    var listGender = [
      {id: false, name: "Nam"},
      {id: true, name: "N???"}
    ]

    return listGender
  }

  listStatus(){
    var listStatus = [
      {id: false, name: "Ch??a k??ch ho???t"},
      {id: true, name: "???? k??ch ho???t"}
    ]

    return listStatus
  }

  validateComment(data:any, model: any){
    model.total = 0
    if(data.commentText == null || data.commentText == ""){
      model.commentText = "[B??nh lu???n] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }
    if(data.commentText.length > 1000){
      model.commentText = "[B??nh lu???n] qu?? d??i !"
      model.total += 1
    }
    return model
  }

  validateCommentText(data:any, model: any){
    model.total = 0
    var words = [ 'lolz', 'lone','??mm','??mm','dmm','Dmm','cl','clm','clmm','clgt','Clgt','????o', '????o','?????','?????','Bitch',
    'bitch','Fuck','ncc','?????','????','????','L???n','l???n','l???','cc','kh???ng khi???p','qu???i vl', 'l?? d??i']

    var split = [""]
    //  split = data.commentText.split(" ")
    // var text = ""
    // split.forEach(element => {
    //   if (words.indexOf(element) >= 0) {
    //     text += "*** "
    //   }
    //   else{
    //     text += element + " "
    //   }
    //   data.commentText = text
    // });
    words.forEach(word =>
      data.commentText.replace(/ /g, '').toLowerCase()
        .includes(word.replace(/ /g, '').toLowerCase()) ? split.push(word) : null)

    if(split.length > 1){
      model.commentText = "Xin l???i v?? s??? b???t ti???n n??y, mong b???n kh??ng b??nh lu???n c?? c??c t??? ng??? ti??u c???c !"
      model.total += 1
    }
    return model

  }

  validateCustomer(data: any, model: any){
    model.total = 0
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    //name

    if(data.nameCustomer == null || data.nameCustomer == ""){
      model.nameCustomer = "[H??? v?? t??n] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if (data.nameCustomer.length > 100) {
      model.nameCustomer = "[H??? v?? t??n] qu?? d??i !"
      model.total += 1
    }else if (data.nameCustomer.length < 1) {
      model.nameCustomer = "[H??? v?? t??n] qu?? ng???n !"
      model.total += 1
    }

    // if (data.gender === null) {
    //    err.push("[Gi???i t??nh] kh??ng ???????c ????? tr???ng !")
    // }


    if (data.phone == null || data.phone == "") {
      model.phone = "[S??? ??i???n tho???i] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if (data.phone.length > 15) {
      model.phone = "[S??? ??i???n tho???i] v?????t qu?? 15 s??? !"
      model.total += 1
    }
    else if (data.phone.length < 10) {
      model.phone = "[S??? ??i???n tho???i] kh??ng h???p l??? !"
      model.total += 1
    }else if (!data.phone.startsWith("0")) {
      model.phone = "[S??? ??i???n tho???i] kh??ng h???p l??? !"
      model.total += 1
    }

    if (data.address == null || data.address == "") {
      model.address = "[?????a ch???] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if (data.address.length > 255) {
      model.address = "[?????a ch???] qu?? d??i !"
      model.total += 1
    }

    let timeDiff = Math.abs(Date.now() - Date.parse(data.birthday));
    let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    //BirthDay
    if(age < 16){
      model.birthday = "[Ng??y sinh] ph???i tr??n 16 tu???i !"
      model.total += 1
    }
    // if(data.password == null  || data.password == ""){
    //   err.push("[M???t kh???u] kh??ng ???????c ????? tr???ng !")
    // }

    // if(data.confirmPassword == null  || data.confirmPassword == ""){
    //   err.push("[Nh???p l???i m???t kh???u] kh??ng ???????c ????? tr???ng !")
    // }else if(data.password != data.confirmPassword){
    //   err.push("[M???t kh???u kh??ng kh???p] nh???p l???i m???t kh???u !")
    // }
    return model

   }

   validateChangePass(data: any, model: any){
    model.total = 0

    if(data.password == null  || data.password == ""){
      model.password = ("[M???t kh???u c??] kh??ng ???????c ????? tr???ng !")
      model.total += 1
    }

    if(data.newPassword == null  || data.newPassword == ""){
      model.newPassword = ("[M???t kh???u m???i] kh??ng ???????c ????? tr???ng !")
      model.total += 1
    }else if(data.password === data.newPassword){
      model.newPassword = ("[M???t kh???u m???i] kh??ng tr??ng m???t kh???u c?? !")
      model.total += 1
    }

    if(data.confirmPassword == null  || data.confirmPassword == ""){
      model.confirmPassword = ("[Nh???p l???i m???t kh???u] kh??ng ???????c ????? tr???ng !")
      model.total += 1
    }else if(data.newPassword != data.confirmPassword){
      model.confirmPassword = ("[Nh???p l???i m???t kh???u kh??ng kh???p] nh???p l???i m???t kh???u !")
      model.total += 1
    }
    return model
   }


   validateInfoCustomer(data: any, model: any, isCheck: boolean){
    model.total = 0
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //nameCustomer
    if (isCheck) {
      if(data.nameCustomer == null || data.nameCustomer == ""){
        model.nameCustomer = "[T??n ng?????i ??i] kh??ng ???????c ????? tr???ng !";
        model.total += 1
     }
     else if (data.nameCustomer > 30) {
      model.nameCustomer = "[T??n ng?????i ??i] qu?? d??i !";
      model.total += 1
     }else if (data.nameCustomer < 3) {
      model.nameCustomer = "[T??n ng?????i ??i] qu?? ng???n !";
      model.total += 1
     }
    }

    //nameContact
    if(data.nameContact == null || data.nameContact == ""){
      model.nameContact = "[T??n ng?????i li??n l???c] kh??ng ???????c ????? tr???ng !";
      model.total += 1
    }
    else if (data.nameContact > 30) {
      model.nameContact = "[T??n ng?????i li??n l???c] qu?? d??i !";
      model.total += 1
    }else if (data.nameContact < 3) {
      model.nameContact = "[T??n ng?????i li??n l???c] qu?? ng???n !";
      model.total += 1
    }

    //Phone
    if (data.phone == null || data.phone == "") {
      model.phone = "[S??? ??i???n tho???i] kh??ng ???????c ????? tr???ng !";
      model.total += 1
    }else if (data.phone.length > 15) {
      model.phone = "[S??? ??i???n tho???i] v?????t qu?? 10 s??? !";
      model.total += 1
    }else if (!data.phone.startsWith("0")) {
      model.phone = "[S??? ??i???n tho???i] kh??ng h???p l??? !";
      model.total += 1
    }

    //email
    if (data.email == null || data.email == "") {
      model.email = "[Email] kh??ng ???????c ????? tr???ng !";
      model.total += 1
   }else if (!filter.test(data.email)) {
      model.email = "[Email] kh??ng h???p l??? !";
      model.total += 1
   }
    return model
   }

   validateLogin(data: any, model: any){
    model.total = 0
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (data.email == null || data.email == "") {
      model.email = "[Email] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if (!filter.test(data.email)) {
      model.email = "[Email] kh??ng h???p l??? !"
      model.total += 1
    }

    if(data.password == null || data.password == ""){
      model.password = "[M???t kh???u] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }

    return model
   }

   validateRegister(data: any, model: any){
    model.total = 0
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if(data.nameCustomer == null || data.nameCustomer == ""){
      model.nameCustomer = "[H??? & t??n] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }

    if (data.email == null || data.email == "") {
      model.email = "[Email] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if (!filter.test(data.email)) {
      model.email = "[Email] kh??ng h???p l??? !"
      model.total += 1
    }

    if(data.phone == null || data.phone == ""){
      model.phone = "[S??? ??i???n tho???i] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if (data.phone.length > 15) {
      model.phone = "[S??? ??i???n tho???i] v?????t qu?? 10 s??? !";
      model.total += 1
    }else if (!data.phone.startsWith("0")) {
      model.phone = "[S??? ??i???n tho???i] kh??ng h???p l??? !";
      model.total += 1
    }

    if(data.address == null || data.address == ""){
      model.address = "[?????a ch???] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }

    if(data.password == null || data.password == ""){
      model.password = "[M???t kh???u] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }

    if(data.confirmPassword == null || data.confirmPassword == ""){
      model.confirmPassword = "[Nh???p l???i m???t kh???u] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if(data.password != data.confirmPassword){
      model.confirmPassword = "[Nh???p l???i m???t kh???u] kh??ng tr??ng kh???p  !"
      model.total += 1
    }

    return model
   }
   validateForgotPass(data: any, model: any){
    model.total = 0

    if(data.password == null || data.password == ""){
      model.password = "[M???t kh???u] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }

    if(data.confirmPassword == null || data.confirmPassword == ""){
      model.confirmPassword = "[Nh???p l???i m???t kh???u] kh??ng ???????c ????? tr???ng !"
      model.total += 1
    }else if(data.password != data.confirmPassword){
      model.confirmPassword = "[Nh???p l???i m???t kh???u] kh??ng tr??ng kh???p  !"
      model.total += 1
    }
    return model
   }

   validateOtp(data: any, model: any, isOtp: boolean){
    model.total = 0
    var timePresent = Date.now()
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (isOtp) {
      if(data.checkOTP == null || data.checkOTP == ""){
        model.checkOTP = "[OTP] kh??ng ???????c ????? tr???ng !"
        model.total += 1
      }else if(data.checkOTP != data.otpCode){
        model.checkOTP = "[OTP] kh??ng h???p l??? !"
        model.total += 1
      }

      if(data.endTime < timePresent){
        model.checkOTP = "[OTP] kh??ng c??n h???p l??? !"
        model.total += 1
      }
    }
    else{
      if (data.email == null || data.email == "") {
        model.email = "[Email] kh??ng ???????c ????? tr???ng !"
        model.total += 1
      }else if (!filter.test(data.email)) {
        model.email = "[Email] kh??ng h???p l??? !"
        model.total += 1
      }
    }

    return model
   }

   formatFromUnixTimestampToFullDate(unix_timestamp: number){
    var date = new Date(unix_timestamp).toLocaleDateString("en-US");
    var split = date.split("/")
    var day = split[1];
    var month = split[0];
    var year =  split[2];
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate
   }

   listLanguage(){
    var listlanguage = [
      {id: "vi", name: "Vietnamese"},
      {id: "en", name: "English"},
      {id: "fr", name: "French"},
      {id: "ko", name: "Korean"},
      {id: "it", name: "Italian"}
    ]

    return listlanguage
  }
}



