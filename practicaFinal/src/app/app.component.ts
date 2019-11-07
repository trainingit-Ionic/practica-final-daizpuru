import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Item } from './item';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private itemsDisponibles = [
    // tslint:disable-next-line: max-line-length
    new Item(1, 'Spring in Action', 'Spring in Action, Fourth Edition is a hands-on guide to the Spring Framework, updated for version 4.', 32.52),
    // tslint:disable-next-line: max-line-length
    new Item(2, 'Pro Angular 6', 'Best-selling author Adam Freeman shows you how to use Angular in your projects.', 38.97),
    // tslint:disable-next-line: max-line-length
    new Item(3, 'Effective Java', 'The principal enhancement in Java 8 was the addition of functional programming constructs to Java object-oriented roots. For Java 7, 8, and 9.', 43.88),
    // tslint:disable-next-line: max-line-length
    new Item(4, 'Java Concurrency in Practice', 'Provides the best explanation yet of these new features, and of concurrency in general', 49.46),
    // tslint:disable-next-line: max-line-length
    new Item(5, 'Web Design with HTML, CSS, JavaScript and jQuery Set', 'A two-book set for web designers and front-end developers.', 46.43),
    // tslint:disable-next-line: max-line-length
    new Item(6, 'Docker: Up & Running: Shipping Reliable Containers in Production', 'Helps understanding how Linux containers fit into your workflow—and getting the integration details right—is not a trivial task.', 26.03),
    new Item(7, 'Cloud Native Java', 'Cloud Native Java Book', 33.28),
    new Item(8, 'Docker & Kubernetes Fundamentals', 'Docker & Kubernetes Fundamentals book', 7.54),
    new Item(9, 'AWS Certified Solutions Architect Study Guide', 'Associate SAA-C01 Exam', 39.75)
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  public numElementosCarrito = 0;

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('catalogoProductos').then((elems) => {
        if (elems != null) {
          this.itemsDisponibles = elems;
        } else {
          // Cargamos el catálogo de productos en el localstorage
          this.storage.set('catalogoProductos', this.itemsDisponibles).then(() => {
            console.log('Carga del catálogo de productos correcta.');
          }).catch(() => {
            console.log('Error al guardar los productos disponibles del localstorage.');
          });
        }
      }).catch(() => {
        console.log('Error al cargar los productos disponibles del localstorage.');
      });
    });
  }
}
