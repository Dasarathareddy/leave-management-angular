import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Constant } from '../constant/constant';
import { Employee } from '../model/employee';

@Injectable()
export class EmployeeService {

  constructor(private http: HttpClient) { }

  errorHandler(error: any) {
    console.log("Employee api error ", error);
    return throwError(error);
  }

  getAllEmployees(page, size, sort): Observable<any> {
    return this.http.get<Employee[]>(Constant.API_ENDPOINT + "/rest/employees",
      {
        params: {
          page: page,
          size: size,
          sort: sort
        }
      })
      .pipe(catchError(this.errorHandler));
  }

  getEmployeeById(id): Observable<Employee[]> {
    return this.http.get<Employee[]>(Constant.API_ENDPOINT + "/rest/employees/" + id)
      .pipe(catchError(this.errorHandler));
  }

  createEmployee(EmployeeData): Observable<Employee[]> {
    return this.http.post<any>(Constant.API_ENDPOINT + "/rest/employees", EmployeeData)
      .pipe(catchError(this.errorHandler));
  }

  updateEmployee(EmployeeData): Observable<Employee[]> {
    return this.http.put<any>(Constant.API_ENDPOINT + "/rest/employees", EmployeeData)
      .pipe(catchError(this.errorHandler));
  }

  getEmployeeUnderSupervision(id): Observable<Employee[]> {
    return this.http.get<Employee[]>(Constant.API_ENDPOINT + "/rest/employees/employees-under-supervision/" + id)
      .pipe(catchError(this.errorHandler));
  }

  getEmployeeByFullName(inputvalue): Observable<any> {
    return this.http.get<Employee[]>(Constant.API_ENDPOINT + "/rest/employees/employee-by-fullname",
      {
        params: {
          fullname: inputvalue
        }
      }
    )
      .pipe(catchError(this.errorHandler));
  }

}
