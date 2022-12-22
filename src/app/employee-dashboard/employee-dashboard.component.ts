import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeData } from './employee.model';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

declare var jQuery: any;
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective | undefined;
  mySubscription;
  formValue!: FormGroup
  employeeObj: EmployeeData = new EmployeeData;
  allEmployeeData: any;  //EXTRA
  showAdd: boolean = false;
  showBtn: boolean = false;
  title = 'datatables';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = true;
      }
    });


  }
  reLoad() {
    console.log(this.router.url);
    this.router.navigate([this.router.url])
  }
  ngOnInit(): void {
    // this.getAllData(); 
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      destroy: true,
      scrollX: true,
      deferRender: true,
    }; 
    this.formValue = this.formBuilder.group(
      {
        name: [''],
        email: [''],
        mobile: [''],
        address: [''],
        designation: ['']
      }
    )
  }
  ngAfterViewInit(): void {
    this.getAllData();
  }
  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    //do next particular records like  101 - 200 rows.
    //we are calling to api

    console.log('next clicked')
  }
  previousButtonClickEvent(): void {
    //do previous particular the records like  0 - 100 rows.
    //we are calling to API
  }
  clickAddEmp() {
    this.formValue.reset();
    this.showAdd = true;
    this.showBtn = false;
  }
  clickEditEmp() {
    this.showAdd = false;
    this.showBtn = true;
  }
  //Subscribe
  addEmployee() {
    this.employeeObj.name = this.formValue.value.name;
    this.employeeObj.email = this.formValue.value.email;
    this.employeeObj.mobile = this.formValue.value.mobile;
    this.employeeObj.address = this.formValue.value.address;
    this.employeeObj.designation = this.formValue.value.designation;

    this.api.postEmployee(this.employeeObj).subscribe(res => {
      console.log(res);
      alert("Record inserted");
      this.formValue.reset();
      this.ngOnInit();
      this.getAllData();
      window.location.reload();
    }, err => {
      alert("Something went wrong" + err)
    })
  }

  //get data
  getAllData() { 
    
    setTimeout(() => {
      this.api.getEmployee().subscribe(res => {
        this.allEmployeeData = res;
        this.dtTrigger.next(void (0));
        console.log(this.allEmployeeData);
      }); 
    }, 1000);
  }

  //delete
  deleteEmployee(data: any) {
    this.api.deleteEmployee(data.id).subscribe(res => {
      alert("Record Deleted"); 
      window.location.reload();
    })
  }
  //On Edit
  onEditEmployee(data: any) {
    this.employeeObj.id = data.id;
    this.formValue.controls["name"].setValue(data.name);
    this.formValue.controls["email"].setValue(data.email);
    this.formValue.controls["mobile"].setValue(data.mobile);
    this.formValue.controls["address"].setValue(data.address);
    this.formValue.controls["designation"].setValue(data.name);
    this.clickEditEmp();
  }
  //Update
  updateEmployee() {
    this.employeeObj.name = this.formValue.value.name;
    this.employeeObj.email = this.formValue.value.email;
    this.employeeObj.mobile = this.formValue.value.mobile;
    this.employeeObj.address = this.formValue.value.address;
    this.employeeObj.designation = this.formValue.value.designation;

    this.api.updateEmployee(this.employeeObj, this.employeeObj.id).subscribe(res => {
      console.log(res);
      alert("Record Updated");
      this.formValue.reset();
      window.location.reload();
    }, err => {
      alert("Something went wrong")
    })
    this.ngOnInit();
    this.getAllData();
  }
  toggleView()
  { 
    var labels1: any;
      if ($("#example").hasClass("card")) {
        $(".colHeader").remove();
        $("#cv").text("Card View"); 
         $("#trhead").removeClass("disNone");  
      } else {
        labels1 = [];
        $("#example thead th").each(function () {
          labels1.push($(this).text());
        });
        $("#example tbody tr").each(function () {
          $(this)
            .find("td")
            .each(function (column) {
              $("<span class='colHeader'>" + labels1[column] + ":</span>").prependTo(
                $(this)
              );
            });
        });
        $("#cv").text("List View");
        $("#trhead").addClass("disNone");
      }
      $("#example").toggleClass("card"); 
  }
}
