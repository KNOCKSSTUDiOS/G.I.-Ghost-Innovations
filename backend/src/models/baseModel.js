export class BaseModel {
  constructor() {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  touch() {
    this.updatedAt = Date.now();
  }
}

