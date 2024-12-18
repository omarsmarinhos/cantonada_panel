import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthIndexedDBService {
  private readonly DB_NAME = 'UserPanelDB';
  private readonly DB_VERSION = 1;
  private readonly USER_STORE = 'user';
  private db: IDBDatabase | null = null;

  private readonly dbInitialized = new BehaviorSubject<boolean>(false);

  constructor() { }

  async initializeDB(): Promise<void> {
    if (!this.db) {
      try {
        await this.initDB();
        this.dbInitialized.next(true);
      } catch (error) {
        this.dbInitialized.next(false);
        throw new Error(`Error al inicializar la base de datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        reject(new Error(`Error al abrir la base de datos: ${request.error?.message ?? 'Error desconocido'}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.USER_STORE)) {
          db.createObjectStore(this.USER_STORE);
        }
      };
    });
  }

  async saveUser(user: User): Promise<void> {
    await this.ensureDBInit();
    const store = this.getStore(this.USER_STORE, 'readwrite');
    await this.promisifyRequest(store.put(user, this.USER_STORE));
  }

  async getUser(): Promise<User> {
    await this.ensureDBInit();
    const store = this.getStore(this.USER_STORE, 'readonly');
    const user = await this.promisifyRequest(store.get(this.USER_STORE));
    return user;
  }

  async clearUserData(): Promise<void> {
    await this.ensureDBInit();
    const store = this.getStore(this.USER_STORE, 'readwrite');
    await this.promisifyRequest(store.clear());
  }

  private getStore(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  private async ensureDBInit(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(request.error?.message ?? 'Error en la operación de IndexedDB'));
    });
  }

  ngOnDestroy() {
    if (this.db) {
      this.db.close();
    }
  }
}