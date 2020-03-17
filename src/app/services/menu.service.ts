import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Menu, Item } from '../common/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  collectionName: string = 'menus';
  itemCollectionName: string = 'items';
  menuRefs: CollectionReference;
  constructor(private firestore: AngularFirestore) {
    this.menuRefs = this.firestore.collection(this.collectionName).ref;
  }
  getMenus() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }
  createMenu(menu: Menu) {
    return this.menuRefs.add(menu);
  }
  updateMenu(menu: Menu) {
    delete menu.id;
    this.firestore.doc(this.collectionName + '/' + menu.id).update(menu);
  }
  deleteMenu(menuId: string) {
    this.firestore.doc(this.collectionName + '/' + menuId).delete();
  }

  
  getMenuItems(menuid) {
    return this.firestore.collection(this.collectionName).doc(menuid).collection(this.itemCollectionName).snapshotChanges();
  }
  createItem(menuid: string, item) {
    console.log("item:", item);
    // return this.menuRefs.doc(menuid).collection(this.itemCollectionName).add(item);

    return this.menuRefs.doc(menuid).collection(this.itemCollectionName).doc().set(Object.assign({}, item), { merge: true })
  }
  updateItem(menuid: string, item: Item) {
    delete item.id;
    this.menuRefs.doc(menuid).collection(this.itemCollectionName).doc(item.id).update(item);
    // this.firestore.doc(this.collectionName + '/' + item.id).update(item);
  }
  deleteItem(menuid: string, itemId: string) {
    this.menuRefs.doc(menuid).collection(this.itemCollectionName).doc(itemId).delete();
    // this.firestore.doc(this.collectionName + '/' + itemId).delete();
  }
}
