import { Document } from './document';

export class Registry {
  dateAdded: Date;
  date: Date;
  name: string;
  links: string[];
  indicatorID: number;
  documents: Document [] = new Array<Document>();
  discriminator: string;
  quantity: number;
  registryID: number;
  activity: string;
  percent: number;

  constructor(dateAdded?: Date, date?: Date, name?: string,
     urlDocuments?: string[], quantity?: number, percent?: number ) {
    this.date = date;
    this.dateAdded = dateAdded;
    this.name = name;
    this.links = urlDocuments;
    this.quantity = 0;
    this.percent = 0;
  }
}
