import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Pipe, PipeTransform  } from '@angular/core';
import { ScheduleService } from "../../../services_API/schedule.service";
import { ScheduleModel } from "../../../models/schedule.model";
import { ResponseModel } from "../../../models/responsiveModels/response.model";
import { NotificationService } from "../../../services_API/notification.service";
import { ConfigService } from "../../../services_API/config.service";
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { StatusNotification } from "../../../enums/enum";

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss']
})
export class TourDetailComponent implements OnInit {
  resSchedule: ScheduleModel
  resSchedules: ScheduleModel[]
  resScheduleRelate: ScheduleModel[]
  response: ResponseModel
  constructor(private scheduleService: ScheduleService, private notificationService: NotificationService, private configService: ConfigService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.init(this.activatedRoute.snapshot.paramMap.get('id1'))
    this.initScheduleRelated(this.activatedRoute.snapshot.paramMap.get('id1'))
  }

 init(idSchedule: string){
    this.scheduleService.getsSchedulebyIdSchedule(idSchedule).then(res => {
      this.response = res
      if (this.response.notification.type == StatusNotification.Success) {
        this.resSchedule = this.response.content
        if (this.resSchedule.promotions.idPromotion != 1) {
          if (this.resSchedule.isHoliday) {
            this.resSchedule.pricePromotion = this.resSchedule.finalPriceHoliday - (this.resSchedule.finalPriceHoliday * this.resSchedule.promotions.value /100)
            this.resSchedule.priceAdultPromotion = this.resSchedule.priceAdultHoliday - (this.resSchedule.priceAdultHoliday * this.resSchedule.promotions.value /100)
              this.resSchedule.priceChildPromotion = this.resSchedule.priceChildHoliday - (this.resSchedule.priceChildHoliday * this.resSchedule.promotions.value /100)
              this.resSchedule.priceBabyPromotion = this.resSchedule.priceBabyHoliday - (this.resSchedule.priceBabyHoliday * this.resSchedule.promotions.value /100)
          }
          else{
            this.resSchedule.pricePromotion = this.resSchedule.finalPrice - (this.resSchedule.finalPrice * this.resSchedule.promotions.value /100)
            this.resSchedule.priceAdultPromotion = this.resSchedule.priceAdult - (this.resSchedule.priceAdult * this.resSchedule.promotions.value /100)
              this.resSchedule.priceChildPromotion = this.resSchedule.priceChild - (this.resSchedule.priceChild * this.resSchedule.promotions.value /100)
              this.resSchedule.priceBabyPromotion = this.resSchedule.priceBaby - (this.resSchedule.priceBaby * this.resSchedule.promotions.value /100)
          }
        }

        this.scheduleService.getsSchedulebyIdTour(this.resSchedule.tour.idTour).then(res => {
          this.response = res
          if (this.response.notification.type == StatusNotification.Success) {
            this.resSchedules = this.response.content

            this.resSchedules.forEach(schedule => {
             if (schedule.promotions.idPromotion != 1) {
              if (schedule.isHoliday) {
                schedule.pricePromotion = schedule.finalPriceHoliday - (schedule.finalPriceHoliday * this.resSchedule.promotions.value /100)
              }
              else{
                schedule.pricePromotion = schedule.finalPrice - (schedule.finalPrice * this.resSchedule.promotions.value /100)
              }
             }
            });

          }
        }, error => {
          var message = this.configService.error(error.status, error.error != null?error.error.text:"");
          this.notificationService.handleAlert(message, StatusNotification.Error)
        })
      }
      else{
         location.assign(this.configService.clientUrl + "/page404")
      }

    }, error => {
      var message = this.configService.error(error.status, error.error != null?error.error.text:"");
      this.notificationService.handleAlert(message, StatusNotification.Error)
    })
  }

  initScheduleRelated(idSchedule: string){
    this.scheduleService.getsScheduleRelatebyIdSchedule(idSchedule).then(res => {
      this.response = res
      console.log(res);

      if (this.response.notification.type == StatusNotification.Success) {
        this.resScheduleRelate = this.response.content
        this.resScheduleRelate.forEach(schedule => {
          if (schedule.promotionId != 1) {
            if (schedule.isHoliday) {
              schedule.pricePromotion = schedule.finalPriceHoliday - (schedule.finalPriceHoliday * schedule.valuePromotion /100)
            }
            else{
              schedule.pricePromotion = schedule.finalPrice - (schedule.finalPrice * schedule.valuePromotion /100)
            }
          }
        });
      }
    }, error => {
      var message = this.configService.error(error.status, error.error != null?error.error.text:"");
      this.notificationService.handleAlert(message, StatusNotification.Error)
    })
  }
  scheduleChange(departureDate: any){
    var tour = this.resSchedule.tour
    this.resSchedules.forEach(schedule => {
      if (schedule.departureDate == departureDate) {
        schedule.tour = tour
        // this.resSchedule.returnDate = schedule.returnDate
        // this.resSchedule.idSchedule = schedule.idSchedule
        // this.resSchedule.description = schedule.description
        // this.resSchedule.departurePlace = schedule.departurePlace
        // this.resSchedule.alias = schedule.alias
        // this.resSchedule.isHoliday = schedule.isHoliday
        // this.resSchedule.finalPrice = schedule.finalPrice
        // this.resSchedule.finalPriceHoliday = schedule.finalPriceHoliday
        // this.resSchedule.isHoliday = schedule.isHoliday
        // this.resSchedule.priceAdult = schedule.priceAdult
        // this.resSchedule.priceAdultHoliday = schedule.priceAdultHoliday
        // this.resSchedule.priceChild = schedule.priceChild
        // this.resSchedule.priceChildHoliday = schedule.priceChildHoliday
        // this.resSchedule.priceBaby = schedule.priceBaby
        // this.resSchedule.priceBabyHoliday = schedule.priceBabyHoliday
        // this.resSchedule.additionalPrice = schedule.additionalPrice
        // this.resSchedule.additionalPriceHoliday = schedule.additionalPriceHoliday
        this.resSchedule = Object.assign({}, schedule)
        if (this.resSchedule.promotions.idPromotion != 1) {
          if (this.resSchedule.isHoliday) {
            this.resSchedule.pricePromotion = this.resSchedule.finalPriceHoliday - (this.resSchedule.finalPriceHoliday * this.resSchedule.promotions.value /100)
            this.resSchedule.priceAdultPromotion = this.resSchedule.priceAdultHoliday - (this.resSchedule.priceAdultHoliday * this.resSchedule.promotions.value /100)
              this.resSchedule.priceChildPromotion = this.resSchedule.priceChildHoliday - (this.resSchedule.priceChildHoliday * this.resSchedule.promotions.value /100)
              this.resSchedule.priceBabyPromotion = this.resSchedule.priceBabyHoliday - (this.resSchedule.priceBabyHoliday * this.resSchedule.promotions.value /100)
          }
          else{
            this.resSchedule.pricePromotion = this.resSchedule.finalPrice - (this.resSchedule.finalPrice * this.resSchedule.promotions.value /100)
            this.resSchedule.priceAdultPromotion = this.resSchedule.priceAdult - (this.resSchedule.priceAdult * this.resSchedule.promotions.value /100)
              this.resSchedule.priceChildPromotion = this.resSchedule.priceChild - (this.resSchedule.priceChild * this.resSchedule.promotions.value /100)
              this.resSchedule.priceBabyPromotion = this.resSchedule.priceBaby - (this.resSchedule.priceBaby * this.resSchedule.promotions.value /100)
          }
        }
      }
    });


  }
  booking(idSchedule: string, alias: string){
    localStorage.removeItem("tourBooking_" + localStorage.getItem("idUser"))
    this.router.navigate(['','tour-booking',idSchedule, alias]);
  }

}
