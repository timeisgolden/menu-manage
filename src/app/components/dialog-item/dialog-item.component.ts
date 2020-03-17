import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from 'src/app/common/menu.model';

@Component({
  selector: 'app-dialog-item',
  templateUrl: './dialog-item.component.html',
  styleUrls: ['./dialog-item.component.scss']
})
export class DialogItemComponent implements OnInit {
  item: Item;
  isNew: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<DialogItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.item = data.item;
    this.isNew = data.isNew;
    console.log("selecte item:", data.item);

  }
  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
