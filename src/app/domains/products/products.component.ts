import { Component, inject, signal } from '@angular/core';
import { AlertService } from '../shared/services/alert.service';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../shared/services/category.service';
import { Category } from '../shared/models/Category.model';
import { UpperCasePipe } from '@angular/common';
import { Product } from '../shared/models/Product.model';
import { ProductCardComponent } from "./components/product-card/product-card.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatIconModule,
    UpperCasePipe,
    ProductCardComponent
],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export default class ProductsComponent {

  readonly categoryService = inject(CategoryService);
  readonly alertService = inject(AlertService);

  categories = signal<Category[]>([]);
  selectedCategory: string = 'TODOS';

  products = signal<Product[]>([
    {
      iIdProducto: 1,
      tNombre: "Producto 01",
      tDescripcion: "Descrioción breve, no muy larga. 10 palabras como máximo",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/15.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 2,
      tNombre: "Producto 02",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/14.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 3,
      tNombre: "Producto 03",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/13.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 4,
      tNombre: "Producto 04",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/12.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 5,
      tNombre: "Producto 05",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/5.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 6,
      tNombre: "Producto 06",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/6.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 7,
      tNombre: "Producto 07",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/7.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 8,
      tNombre: "Producto 08",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/8.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 9,
      tNombre: "Producto 09",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/9.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 10,
      tNombre: "Producto 10",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/10.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    },
    {
      iIdProducto: 11,
      tNombre: "Producto 11",
      tDescripcion: "",
      dPrecio: 24,
      tImagenUrl: "http://192.168.1.11:5000/img/categoria/11.png",
      lPrincipal: true,
      lDelivery: true,
      lRecoger: true,
      lConsumir: true
    }
  ])

  ngOnInit() {
    this.loadCategories();
  }

  onAddProduct() {

  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    });
  }

  changeCategory(category: string) {
    this.selectedCategory = category;
  }
}
