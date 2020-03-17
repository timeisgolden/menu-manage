import { Component, OnInit, OnDestroy } from '@angular/core';
import { Menu, Item } from '../common/menu.model';
import { MenuService } from '../services/menu.service';
import { MatDialog } from '@angular/material';
import { DialogAddCategoryComponent } from '../components/dialog-add-category/dialog-add-category.component';
import { DialogItemComponent } from '../components/dialog-item/dialog-item.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit, OnDestroy {
  menus: Menu[];
  selectedMenuItems: Item[] = [];
  selectedMenu: Menu;
  menusSubs: Subscription = new Subscription();
  menuitemsSubs: Subscription = new Subscription();
  constructor(private menuService: MenuService, public dialog: MatDialog) { }

  ngOnInit() {
    this.menusSubs = this.menuService.getMenus().subscribe(data => {
      this.menus = data.map(e => {
        return { id: e.payload.doc.id, ...e.payload.doc.data() } as Menu;
      })
    });
  }

  ngOnDestroy() {
    this.menusSubs.unsubscribe();
    this.menuitemsSubs.unsubscribe();
  }

  selectMenu(menu: Menu) {
    this.selectedMenu = menu;
    if (!this.selectedMenu.id) return;
    this.menuitemsSubs = this.menuService.getMenuItems(this.selectedMenu.id).subscribe(data => {
      this.selectedMenuItems = data.map(e => {
        return { id: e.payload.doc.id, ...e.payload.doc.data() } as Item;
      })
    });
  }

  openMenuDialog(): void {
    const dialogRef = this.dialog.open(DialogAddCategoryComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed:', result);
      if (!result) return;
      let newMenu: Menu = {
        name: result
      }
      this.create(newMenu);
    });
  }
  openItemDialog(item?: Item): void {
    const dialogRef = this.dialog.open(DialogItemComponent, {
      width: '250px',
      data: {
        isNew: item ? false : true,
        item: item ? item : new Item()
      }
    });

    dialogRef.afterClosed().subscribe(item => {
      console.log('The dialog was closed:', item);
      if (!item) return;
      if (!this.selectedMenu.id) return;
      this.menuService.createItem(this.selectedMenu.id, item);
    });
  }


  create(menu: Menu) {
    this.menuService.createMenu(menu);
  }

  update(menu: Menu) {
    this.menuService.updateMenu(menu);
  }

  delete(id: string) {
    this.menuService.deleteMenu(id);
  }

}
