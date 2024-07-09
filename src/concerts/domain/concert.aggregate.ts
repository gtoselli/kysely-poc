import { nanoid } from 'nanoid';

export class ConcertAggregate {
  constructor(
    public readonly id: string,
    public title: string,
  ) {}

  static factory(title: string) {
    return new ConcertAggregate(nanoid(), title);
  }

  public rename(newTitle: string) {
    this.title = newTitle;
  }
}
