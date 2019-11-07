import { Platform, ToastController } from '@ionic/angular';
import { Item } from './../item';
import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  private carroCompra = [];

  public itemsDisponibles = [];

  constructor(private storage: Storage, private platform: Platform, private toastController: ToastController) {
  }

  addItem(id: number) {
    const found: Item = this.itemsDisponibles.find(i => i.id === id);
    this.carroCompra.push(found);
    this.updateCarroCompra();
  }

  deleteItem(id: number) {
    const found: Item = this.itemsDisponibles.find(i => i.id === id);
    this.carroCompra.splice(this.carroCompra.indexOf(found), 1);
    this.updateCarroCompra();
  }

  checkItemAdded(id: number) {
    const found: Item = this.carroCompra.find(item => item.id === id);

    if (found != null) {
      return true;
    } else {
      return false;
    }
  }

  async registrarItem(form: NgForm) {
    const nombreItem: string = form.value.nombreItem;
    const descripcionItem: string = form.value.descripcionItem;
    const precioItem: number = form.value.precioItem;

    if (nombreItem != null && descripcionItem != null &&
      precioItem != null && precioItem > 0) {
      const id = Math.floor(Math.random() * 1100) + 1000;

      const nuevoItem: Item = new Item(id, nombreItem, descripcionItem, precioItem);

      const itemExiste = this.carroCompra.find(i => i.nombre === nombreItem);

      if (itemExiste != null) {
        this.presentError('Ya ha incluido ese item en el carrito de la compra.');
      } else {
        // Registramos el producto en el catálogo
        this.itemsDisponibles.unshift(nuevoItem);

        this.storage.set('catalogoProductos', this.itemsDisponibles).then(() => {
          form.resetForm();
          this.presentToast();
          console.log('Actualización del catálogo de productos correcta.');
        }).catch(() => {
          console.log('Error al actualizar el catálogo de productos en el localstorage.');
        });
      }
    } else {
      this.presentError('No se ha podido registrar el producto, rellene los campos obligatorios');
    }
  }

  updateCarroCompra() {
    this.storage.set('carritoCompra', this.carroCompra).then(() => {
      console.log('Actualización del carrito de la compra correcta.');
    }).catch(() => {
      console.log('Error al actualizar el carrito de la compra en el localstorage.');
    });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Cargamos del LocalStorage la lista de productos
      this.storage.get('catalogoProductos').then((elems) => {
        this.itemsDisponibles = elems;
      }).catch(() => {
        console.log('Error al cargar los productos disponibles del localstorage.');
      });

      // Cargamos del LocalStorage la lista de productos
      this.storage.get('carritoCompra').then((elems) => {
        if (elems != null) {
          this.carroCompra = elems;
        }
      }).catch(() => {
        console.log('Error al cargar el carrito de la compra del localstorage.');
      });
    });

    // Subscribe al Subject #pause
    this.platform.pause.subscribe(
      () => this.updateCarroCompra()
    );

    // Subscribe al Subject #resume
    this.platform.resume.subscribe(
      () => {
        // Cargamos del LocalStorage el catálogo de productos
        this.storage.get('catalogoProductos').then((elems) => {
          this.itemsDisponibles = elems;
        }).catch(() => {
          console.log('Error al cargar los productos disponibles del localstorage.');
        });

        // Cargamos del LocalStorage la lista de productos
        this.storage.get('carritoCompra').then((elems) => {
          if (elems != null) {
            this.carroCompra = elems;
          }
        }).catch(() => {
          console.log('Error al cargar el carrito de la compra del localstorage.');
        });
      }
    );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Producto registrado correctamente',
      duration: 2000
    });
    toast.present();
  }

  async presentError(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000
    });
    toast.present();
  }
}
