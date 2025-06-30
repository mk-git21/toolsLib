
export class Singleton {
    protected constructor() { };

    public static GetIns<T>(this: any, params?: any): T {
        let Class: any = this;
        if (Class._ins == null) {
            Class._ins = new Class(params);
        }
        return Class._ins;
    }

}








