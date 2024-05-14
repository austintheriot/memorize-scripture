export class RequestManager {
  private _id = 0;

  public getNewId(): number {
    this._id += 1;
    return this._id;
  }

  public isMostRecentRequest(id: number): boolean {
    return this._id === id;
  }
}
