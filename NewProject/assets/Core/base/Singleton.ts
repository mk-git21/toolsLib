
export class Singleton {
    protected constructor() { };

    public static GetIns<T>(this: new (...args: any[]) => T, params?: any) {
        let Class: any = this;
        if (Class._ins == null) {
            Class._ins = new Class(params);
        }
        return Class._ins;
    }

}








