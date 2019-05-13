import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';

import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { Plataform } from '../../interfaces/plataform';

import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  plataforms: any;
  plataformsColumns: string[] = ['name', 'tax', 'plataformsOptions'];
  @ViewChild(MatPaginator) platformsPaginator: MatPaginator;
  
  users: any;
  usersColumns: string[] = ['displayName', 'idDocument', 'idDocumentImage', 'status', 'usersOptions'];
  @ViewChild(MatPaginator) usersPaginator: MatPaginator;

  newPlataform: string;
  newComission: number;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    this.getUsers();
    this.getPlataforms();
  }

  getPlataforms() {
    this.userService.getPlataforms()
      .subscribe( (plataforms: Plataform[]) => {
        this.plataforms = new MatTableDataSource(plataforms);
        this.plataforms.paginator = this.platformsPaginator;
      });
  }

  getUsers() {
    this.userService.getUsers()
      .subscribe( (users: User[]) => {
        this.users = new MatTableDataSource(users);
        this.users.paginator = this.usersPaginator;
      });
  }

  registerPlataform() {
    const id = Date.now();
    this.userService.registerPlataform('Plataforma', id);
  }

  openDialog(op: string, uid: string, date?: number) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '300px',
      data: {
        uid: uid,
        date: date,
        operation: op,
      }
    });
    dialogRef.afterClosed()
    .subscribe( result => {
      if (result) {
        //- Poner Condicional
        this.openSnackBar(result.message);
        this.getPlataforms();
        this.getUsers();
      }
    }, error => {
      console.log(error);
      this.openSnackBar('Ocurrió un error al realizar la operación', error);
    });
  }

  openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: 2500,
    });
  }


}
