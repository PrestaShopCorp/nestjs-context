export interface IContextPropertyProvider {
  get(request?: any, property?: string): any;
}
