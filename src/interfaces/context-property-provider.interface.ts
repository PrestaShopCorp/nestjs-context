export interface IContextPropertyProvider {
  get(
    request?: any,
    property?: string,
    setValues?: Map<string | symbol, any>,
  ): any;
}
