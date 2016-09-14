import {Observable} from 'data/observable';

export class HelloWorldModel extends Observable {

  public message: string;
  private _tags: string[];

  set tags(val: string[]) {
    if (this._tags !== val) {
          this._tags = val;
          this.notifyPropertyChange('tags', val);
      }
  }

  get tags(): string[] {
    return this._tags;
  }

  constructor() {
    super();
    this.message = 'Hello Music Genres';
    this.chinese();
  }

  public chinese() {
    this.tags = ['古琴', '二胡', '古筝', '琵琶'];
  }

  public western() {
    this.tags = ['Pop', 'Rock', 'Jazz', 'Blue'];
  }

}