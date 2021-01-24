import { Component, OnInit, Input, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { first } from 'rxjs/operators';

import { AlertService } from 'app/services/alert.service';
import { ReferencesService } from 'app/services/references.service';
import { OperationsService } from 'app/services/operations.service';

import { ReferenceHeader } from 'app/interfaces/reference-header';
import { Reference } from 'app/interfaces/reference';
import { OperationType } from 'app/interfaces/operation-type';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})

export class ConfigurationComponent implements OnInit {

  @Input() referenceHeaders: ReferenceHeader[] = [];
  @Input() referenceDetail: Reference;
  @Input() referenceDetails: Reference[] =  [];
  dataReferenceDetail = {
    ref_no: 0,
    ref_id: "",
    ref_desc: "",
    active: true
  };

  @Input() operationTypes: OperationType[] = [];

  public reactiveForm: FormGroup = new FormGroup({
    checked: new FormControl(true),
    unchecked: new FormControl(false)
  });

  displayedColumns: string[] = ['id', 'description'];

  public ReferenceForm: FormGroup;

  public submitted = false;
  public loading = false;

  public selectedReference: number = 0;
  public openReference: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private referencesService: ReferencesService,
    private operationsService: OperationsService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) { }

  ngOnInit(){

    this.ReferenceForm = this.formBuilder.group({
      Ref_no: ['']
    });

    this.referenceDetail = this.dataReferenceDetail;

    this.getUpdatesReferences();
    this.getUpdatesOperations();

  }

  public getUpdatesOperations(){
    this.operationsService.GetAllOperationsType()
    .pipe(first())
    .subscribe(data => this.operationTypes = data);

  }

  public getUpdatesReferences(){
    this.referencesService.GetAllHeaders()
    .pipe(first())
    .subscribe(data => this.referenceHeaders = data);

    this.referenceDetails = [];
  }

  get f() { return this.ReferenceForm.controls; }

  public selectReference(){
    this.submitted = true;
    this.alertService.clear();
    if (this.ReferenceForm.invalid) {
      return;
    }
    this.loading = true;
    this.openReference = true;
    this.selectedReference = this.f.Ref_no.value;

    this.referencesService.GetAllReference(this.selectedReference)
    .pipe(first())
    .subscribe(data => this.referenceDetails = data);
  }

  public updateReference(reference: Reference){
    const dialogRef = this.dialog.open(dialog_reference, {
      width: '500px',
      data: {reference: reference}
    });

    dialogRef.afterClosed().subscribe(result => {
      var action = result[0].action;
      var reference = result[0].reference;
      console.log(reference);

      if(action == 1 || action == 2){
        this.referencesService.updateReference(reference)
        .pipe(first()).subscribe(data => {
          if(data){
            this.openReference = false;
            this.getUpdatesReferences();
          }
        }
        );
      }
      else{
        return;
      }

    });
  }

  public updateOperation(operation: OperationType){
    const dialogRef = this.dialog.open(dialog_operation, {
      width: '500px',
      data: {operation: operation}
    });

    dialogRef.afterClosed().subscribe(result => {
      var action = result[0].action;
      var operation = result[0].operation
      if(action == 1 || action == 2){
        this.operationsService.updateOperationType(operation)
        .pipe(first()).subscribe(data => {
          if(data){
            this.getUpdatesOperations();
          }
        });
      }
      else{
        return;
      }
    });
  }

  public addRecord(typeRecord: number, id_reference: number){

    const dialogRef = this.dialog.open(dialog_addNew, {
      width: '500px',
      data: {
        typeRecord: typeRecord,
        reference: id_reference
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      var typeRecord = result[0].typeRecord;
      if(typeRecord == 1){
        var reference = result[0].reference;
        this.referencesService.addNewReference(reference)
        .pipe(first()).subscribe(data => {
          if(data){
            this.openReference = false;
            this.getUpdatesReferences();
          }
        });
      }
      else if (typeRecord == 2){
        var operation = result[0].operation;
        this.operationsService.addNewOperationType(operation)
        .pipe(first()).subscribe(data => {
          if(data){
            this.getUpdatesOperations();
          }
        });
      }
      else{
        return;
      }
    });

  }

}

/***** DIALOG UPDATE REFERENCE  *******/
@Component({
  selector: 'dialog_reference',
  templateUrl: './dialog_reference.html',
  styleUrls: ['./configuration.component.css']
})

export class dialog_reference {

  @Input() updateReference: Reference;
  dataReferenceDetail = {
    ref_no: 0,
    ref_id: "",
    ref_desc: "",
    active: true
  };

  constructor(
    public dialogRef: MatDialogRef<dialog_reference>,
    @Inject(MAT_DIALOG_DATA) public data: Reference) {this.updateReference = this.dataReferenceDetail;}

    update(reference: Reference, updateDecrip: string): void {

      this.updateReference.ref_no = reference.ref_no;
      this.updateReference.ref_id = reference.ref_id;
      this.updateReference.ref_desc = updateDecrip;
      this.updateReference.active = reference.active;
      const retorno: Array<{action: number, reference: Reference}> = [{
        action: 1,
        reference: this.updateReference
      }];
      this.dialogRef.close(retorno);
    }

    erase(reference: Reference): void{
      this.updateReference.ref_no = reference.ref_no;
      this.updateReference.ref_id = reference.ref_id;
      this.updateReference.ref_desc = reference.ref_desc;
      this.updateReference.active = false;
      const retorno: Array<{action: number, reference: Reference}> = [{
        action: 2,
        reference: this.updateReference
      }];
      this.dialogRef.close(retorno);
    }

    cancel(): void {
      const retorno: Array<{action: number, reference: Reference}> = [{
        action: 3,
        reference: null
      }];
      this.dialogRef.close(retorno);
    }
}

/***** DIALOG UPDATE OPERATION  *******/
@Component({
  selector: 'dialog_operation',
  templateUrl: './dialog_operation.html',
  styleUrls: ['./configuration.component.css']
})
export class dialog_operation {

  @Input() updateOperation: OperationType;
  dataOperationDetail = {
    codigo_op: 0,
    descripcion: "",
    active: true
  };

  constructor(
    public dialogRef: MatDialogRef<dialog_reference>,
    @Inject(MAT_DIALOG_DATA) public data: OperationType) {this.updateOperation = this.dataOperationDetail;}

    update(operation: OperationType, updateDecrip: string): void {

      this.updateOperation.codigo_op = operation.codigo_op;
      this.updateOperation.descripcion = updateDecrip;
      this.updateOperation.active = operation.active;
      const retorno: Array<{action: number, operation: OperationType}> = [{
        action: 1,
        operation: this.updateOperation
      }];
      this.dialogRef.close(retorno);
    }

    erase(operation: OperationType): void{
      this.updateOperation.codigo_op = operation.codigo_op;
      this.updateOperation.descripcion = operation.descripcion;
      this.updateOperation.active = false;
      const retorno: Array<{action: number, operation: OperationType}> = [{
        action: 2,
        operation: this.updateOperation
      }];
      this.dialogRef.close(retorno);
    }

    cancel(): void {
      const retorno: Array<{action: number, operation: OperationType}> = [{
        action: 3,
        operation: null
      }];
      this.dialogRef.close(retorno);
    }

}

/***** DIALOG ADD RECORD  *******/

@Component({
  selector: 'dialog_addNew',
  templateUrl: './dialog_addNew.html',
  styleUrls: ['./configuration.component.css']
})

export class dialog_addNew {

  @Input() newRecordOperation: OperationType;
  dataOperationDetail = {
    codigo_op: 0,
    descripcion: "",
    active: true
  };

  @Input() newRecordReference: Reference;
  dataReferenceDetail = {
    ref_no: 0,
    ref_id: "",
    ref_desc: "",
    active: true
  };

  public title: string;
  public newReference: boolean = true;
  private id_reference: number = 0;
  public newOperation: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<dialog_reference>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data.typeRecord == 1){
        this.title = "NUEVA REFERENCIA";
        this.newReference = false;
        console.log(this.newReference);
        this.id_reference = data.reference;
        this.newRecordReference = this.dataReferenceDetail;
      }
      else{
        this.title = "NUEVA OPERACIÓN";
        this.newOperation = false;
        this.newRecordOperation = this.dataOperationDetail;
      }
    }

  public addReference(cod: string, descrip: string){
    this.newRecordReference.ref_no = this.id_reference;
    if(cod.length <= 10 && descrip.length <= 100){
      this.newRecordReference.ref_id = cod;
      this.newRecordReference.ref_desc = descrip;
      const retorno: Array<{typeRecord: any, reference: Reference}> = [{
        typeRecord: 1,
        reference: this.newRecordReference
      }];
      this.dialogRef.close(retorno);
    }
  }

  public addOperation(descrip: string){
    this.newRecordOperation.codigo_op = 0;
    this.newRecordOperation.descripcion = descrip;
    const retorno: Array<{typeRecord: any, operation: OperationType}> = [{
      typeRecord: 2,
      operation: this.newRecordOperation
    }];
    this.dialogRef.close(retorno);
  }

  public cancel(): void {
    const retorno: Array<{typeRecord: any, operation: OperationType}> = [{
      typeRecord: 3,
      operation: null
    }];
    this.dialogRef.close(retorno);
  }

}
