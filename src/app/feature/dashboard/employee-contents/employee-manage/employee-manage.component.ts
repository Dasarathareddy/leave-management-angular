import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, concat, of, Subject } from 'rxjs';
import { EmployeeService } from './../../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';

@Component({
  selector: 'app-employee-manage',
  templateUrl: './employee-manage.component.html',
  styleUrls: ['./employee-manage.component.css']
})
export class EmployeeManageComponent implements OnInit {

  has_error: boolean = false;
  create_employee_msg: String;

  supervisorEmployees: Observable<any>;
  employeeinput$ = new Subject<string>();
  employeeSupervisor: Employee = null;
  isSelectLoading: boolean = false;

  submitted: boolean = false;
  registerForm: FormGroup;

  allEmployeeStatus = [
    { "label": "Available", "value": "ACTIVE" },
    { "label": "Not Avilable", "value": "INACTIVE" },
  ];

  constructor(private formBuilder: FormBuilder, private _employeeService: EmployeeService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      email: [''],
      supervisor: [],
      status: [this.allEmployeeStatus[0].value, Validators.required]
    });


    this.loadEmployee();
  }

  private loadEmployee() {
    this.supervisorEmployees = concat(
      of([]), // default items
      this.employeeinput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.isSelectLoading = true),
        switchMap(term => this._employeeService.getEmployeeByFullName(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.isSelectLoading = false)
        ))
      )
    );
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    console.log(this.registerForm.value);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    console.log("success ", this.registerForm.value);

    this._employeeService.createEmployee(this.registerForm.value).subscribe(res => {
      // console.log("creation successful", res);
      this.has_error = false;
      this.create_employee_msg = "Registration Successful";
    }, error => {
      // console.log("user creation error", error.error);
      this.has_error = true;
      this.create_employee_msg = error.error.message;
    });


  }

}