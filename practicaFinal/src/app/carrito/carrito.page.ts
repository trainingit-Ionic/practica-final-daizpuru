import { Component, OnInit } from '@angular/core';
import { Item } from '../item';

import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  public carroCompra: Array<Item> = [];

  public numItems: number;

  public totalCarro: number;

  constructor(private storage: Storage, private platform: Platform) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Cargamos del LocalStorage la lista de productos
      this.storage.get('carritoCompra').then((elems) => {
        this.carroCompra = elems;
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
        // Cargamos del LocalStorage la lista de productos
        this.storage.get('carritoCompra').then((elems) => {
          this.carroCompra = elems;
        }).catch(() => {
          console.log('Error al cargar el carrito de la compra del localstorage.');
        });
      }
    );
    this.calcularTotal();
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      // Cargamos del LocalStorage la lista de productos
      this.storage.get('carritoCompra').then((elems) => {
        this.carroCompra = elems;
        this.calcularTotal();
      }).catch(() => {
        console.log('Error al cargar el carrito de la compra del localstorage.');
      });
    });
  }

  limpiarCarrito() {
    console.log('Limpiando carrito de la compra');
    this.carroCompra = null;
    this.updateCarroCompra();
    this.calcularTotal();
  }

  deleteItem(id: number) {
    const found: Item = this.carroCompra.find(i => i.id === id);
    this.carroCompra.splice(this.carroCompra.indexOf(found), 1);

    if (this.carroCompra.length === 0) {
      this.carroCompra = null;
    }
    this.updateCarroCompra();
    this.calcularTotal();
  }

  updateCarroCompra() {
    this.storage.set('carritoCompra', this.carroCompra).then(() => {
      console.log('Actualización del carrito de la compra correcta.');
    }).catch(() => {
      console.log('Error al actualizar el carrito de la compra en el localstorage.');
    });
  }

  calcularTotal() {
    this.platform.ready().then(() => {
      this.numItems = this.carroCompra.length;

      let total = 0;

      if (this.carroCompra != null && this.carroCompra.length > 0) {
        this.carroCompra.forEach(i => total += Number(i.precio));
      }
      this.totalCarro = total;
    });
  }
}
