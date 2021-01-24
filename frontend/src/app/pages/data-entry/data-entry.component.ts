import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormArray, FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Operation } from 'app/interfaces/operation';
import { OperationType } from 'app/interfaces/operation-type';
import { Finca } from 'app/interfaces/finca';
import { Zona } from 'app/interfaces/zona';
import { Guacho } from 'app/interfaces/guacho';
import { Planta } from 'app/interfaces/planta';
import { Flor } from 'app/interfaces/flor';

import { OperationsService } from 'app/services/operations.service';
import { FarmService } from 'app/services/farm.service';


@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {

  public date = new FormControl(new Date());
  private newDate = new Date();
  private toDayData: boolean = true;
  public view: Observable<GridDataResult>;

  public gridState: State = {
      sort: [],
      skip: 0,
      take: 10
  };

  @Input() Fincas: Finca[] = [];
  @Input() Zonas: Zona[] = [];
  @Input() Guachos: Guacho[] = [];
  @Input() Plantas: Planta[] = [];
  @Input() Flores: Flor[] = [];
  @Input() operationTypes: OperationType[] = [];

  @Input() OperationList: Operation[] = [];
  @Input() OperationRow: Operation;
  dataOperation= {
    operacion: "",
    fecha: this.newDate,
    zona: "",
    guacho: "",
    planta: "",
    flor: "",
    observacion: "",
    active: true
  };


  public fincaSelected: number = 1;
  public zonaSelected: number = 0;
  public guachoSelected: number = 0;
  public plantaSelected: number = 0;
  public florSelected: number = 0;
  public operationSelected: number = 0;

  private operationRoxIndex: number;
  private editedOperation: Operation;

  private editedRowIndex: number;

  constructor(
    private operationsService: OperationsService,
    private farmService: FarmService,
  ){}

  public ngOnInit(): void {
    this.getDataToday();
    this.getFincas();
    this.getZonas(this.fincaSelected);
    this.getOperationsTypes();
  }

  /**** GET DATA ****/

  public getDataToday(){
    this.toDayData = true;

    this.view = this.operationsService.getAllOperations(this.newDate)
                  .pipe(map(data => process(data, this.gridState)));
  }

  public getDataFromDate(event: MatDatepickerInputEvent<Date>): void{
    this.newDate = event.value;
    this.toDayData = false;
    this.view = this.operationsService.getAllOperations(this.newDate)
                  .pipe(map(data => process(data, this.gridState)));
  }

  public getOperationsTypes(){
    this.operationsService.GetAllOperationsType()
    .pipe(first())
    .subscribe(data => this.operationTypes = data);
  }

  public getFincas(){
    this.farmService.GetAllFinca().pipe(first()).subscribe(data => {
      if(data){
        this.Fincas = data;
      }
    });
  }

  public getZonas(finca_id: number){
    this.fincaSelected = finca_id;
    this.farmService.GetAllZona(finca_id).pipe(first()).subscribe(data => {
      if(data){
        this.Zonas = data;
      }
    });
  }

  public getGuacho(zona_id: number){
    this.zonaSelected = zona_id;
    if(this.zonaSelected != null){
      this.farmService.GetAllGuacho(this.fincaSelected, this.zonaSelected).pipe(first()).subscribe(data => {
        if(data){
          this.Guachos = data;
        }
      });
    }
  }

  public getPlanta(guacho_id: number){
    this.guachoSelected = guacho_id;
    if(this.guachoSelected != null){
      this.farmService.GetAllPlanta(this.fincaSelected, this.zonaSelected, this.guachoSelected).pipe(first()).subscribe(data => {
        if(data){
          this.Plantas = data;
        }
      });
    }
  }

  public getFlor(planta_id: number){
    this.plantaSelected = planta_id;
    if(this.plantaSelected != null){
      this.farmService.GetAllFlor(this.fincaSelected, this.zonaSelected, this.guachoSelected, this.plantaSelected).pipe(first()).subscribe(data => {
        if(data){
          this.Flores = data;
        }
      });
    }
  }

  public selectFlor(flor_id: number){
    this.florSelected = flor_id;
  }

  public selectOperation(operation_id: number){
    this.operationSelected = operation_id;
  }

  /**** SET GRID ****/

  public onStateChange(state: State) {
    this.gridState = state;
  }

  public addHandler({sender}, formInstance) {
    let newOperation: Operation;
    let dataNewOperation = {
      operacion: "",
      fecha: this.newDate,
      zona: "",
      guacho: "",
      planta: "",
      flor: "",
      observacion: "",
      active: true
    };
    newOperation = dataNewOperation;
    formInstance.reset();
    this.closeEditor(sender);
    sender.addRow(newOperation);
  }

  public editHandler({sender, rowIndex, dataItem}){
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    this.editedOperation = Object.assign({}, dataItem);
    sender.editRow(rowIndex);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, dataItem, isNew}) {

    let newOperation: Operation;

    console.log(dataItem);

    let id: number = 0;
    if(dataItem.id != undefined){
      id = dataItem.id;
    }

    let zona: string = "0";
    if(dataItem.zona?.toString() != ""){
      zona = dataItem.zona.toString();
    }
    let guacho: string = "0";
    if(dataItem.guacho.toString() != ""){
      guacho = dataItem.guacho?.toString();
    }
    let planta: string = "0";
    if(dataItem.planta?.toString() != ""){
      planta = dataItem.planta?.toString();
    }
    let flor: string = "0";
    if(dataItem.flor?.toString() != ""){
      flor = dataItem.flor?.toString();
    }
    let operacion: string = "0";
    if(dataItem.operacion.toString() != ""){
      operacion = dataItem.operacion.toString();
    }

    let dataNewOperation = {
      id: id,
      fecha: this.newDate,
      zona: zona,
      guacho: guacho,
      planta: planta,
      flor: flor,
      operacion: operacion,
      observacion: dataItem.observacion,
      active: false
    };

    newOperation = dataNewOperation;

    if(isNew){

      console.log(newOperation);

      this.operationsService.addNewOperation(newOperation)
      .pipe(first()).subscribe(data => {
        if(data){
          if(this.toDayData){
            this.getDataToday();
          }
          else{
            this.view = this.operationsService.getAllOperations(this.newDate)
            .pipe(map(data => process(data, this.gridState)));
          }
        }
      });
    }
    else{

      console.log(newOperation);

      this.operationsService.updateOperation(newOperation)
        .pipe(first()).subscribe(data => {
          if(data){
            if(this.toDayData){
              this.getDataToday();
            }
            else{
              this.view = this.operationsService.getAllOperations(this.newDate)
              .pipe(map(data => process(data, this.gridState)));
            }
          }
        });
    }
    sender.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editedOperation = undefined;
  }

  public removeHandler({sender, rowIndex, dataItem}){
    let newOperation: Operation;

    let date = new Date(dataItem.fecha);

    let zona: string = "0";
    let guacho: string = "0";
    let planta: string = "0";
    let flor: string = "0";
    let operacion: string = "0";

    let dataNewOperation = {
      id: dataItem.id,
      fecha: date,
      zona: zona,
      guacho: guacho,
      planta: planta,
      flor: flor,
      operacion: operacion,
      observacion: dataItem.observacion,
      active: false
    };
    newOperation = dataNewOperation;
    console.log(newOperation);

    this.operationsService.updateOperation(newOperation)
        .pipe(first()).subscribe(data => {
          if(data){
            if(this.toDayData){
              this.getDataToday();
            }
            else{
              this.view = this.operationsService.getAllOperations(this.newDate)
              .pipe(map(data => process(data, this.gridState)));
            }
          }
        });
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex){
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editedOperation = undefined;
  }
}
