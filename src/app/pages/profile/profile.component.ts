import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/services_API/notification.service';
import { ConfigService } from "../../services_API/config.service";
import { CustomerService } from 'src/app/services_API/customer.service';
import { CustomerModel } from 'src/app/models/customer.model';
import { ResponseModel } from "../../models/responsiveModels/response.model";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  response: ResponseModel
  resCustomer: CustomerModel
  @Input() type: string

  listGender =  this.configService.listGender()
  isEdit: boolean = false
  isChange: boolean = false
  resCusTmp: CustomerModel
  formData: any
  birthday: string
  birthdayView: string
  constructor(private activatedRoute: ActivatedRoute,private customerService: CustomerService, private notificationService: NotificationService,
    private configService: ConfigService) { }

  ngOnInit(): void {
    // var idCustomer = this.activatedRoute.snapshot.paramMap.get('id')
    // console.log(idCustomer);
    this.listGender = this.configService.listGender()
    console.log(this.listGender);

    this.init()
  }

  // ngOnChanges(): void {
  //   if(this.resCustomer){
  //     if(this.resCustomer.birthday){
  //       this.birthday = this.configService.formatFromUnixTimestampToFullDate(Number.parseInt(this.resCustomer.birthday))
  //       this.birthdayView = this.configService.formatFromUnixTimestampToFullDateView(Number.parseInt(this.resCustomer.birthday))
  //     }
  //   }
  //   this.resCusTmp = Object.assign({}, this.resCustomer)
  // }
    inputChange(){
      this.birthdayView = this.configService.formatFromUnixTimestampToFullDateView(Number.parseInt(this.resCustomer.birthday))
      if (JSON.stringify(this.resCustomer) != JSON.stringify(this.resCusTmp)) {
        this.isChange = true
      }
      else{
        this.isChange = false
      }
    }

    isEditChange(){
      if (this.isEdit) {
        this.isEdit = false
        this.backup()
      }
      else{
        this.isEdit = true
      }
    }

    init(){
      var idCus = localStorage.getItem("idUser")
      this.customerService.get(idCus).subscribe(res =>{
        this.response = res
          this.resCustomer = this.response.content

          if(this.resCustomer.birthday){
            this.resCustomer.birthday = this.configService.formatFromUnixTimestampToFullDate(Number.parseInt(this.resCustomer.birthday))
            this.birthdayView = this.configService.formatFromUnixTimestampToFullDateView(Number.parseInt(this.resCustomer.birthday))
          }
      }, error => {

        var message = this.configService.error(error.status, error.error != null?error.error.text:"");
        this.notificationService.handleAlert(message, "Error")
      })
    }

    inputDateChange(){
      this.birthdayView = this.configService.formatDateToDateView(this.resCustomer.birthday)
    }

    save(){
      var valid = this.configService.validateCustomer(this.resCustomer)
      valid.forEach(element => {
        this.notificationService.handleAlert(element, "Error")
      });
      if(valid.length == 0){
        this.customerService.update(this.resCustomer).subscribe(res =>{
          this.response = res
          this.notificationService.handleAlertObj(res.notification)
          if (this.type == 'detail') {
            this.isEdit = false
          }
          this.isChange = false
        }, error => {
          var message = this.configService.error(error.status, error.error != null?error.error.text:"");
          this.notificationService.handleAlert(message, "Error")
        })
      }
    }

    backup(){
      this.resCustomer = Object.assign({}, this.resCusTmp)
      this.isChange = false
    }
}