
// export class Singleton {
//     constructor() { };
//     protected _ins:any = null;
//     public static GetIns<T>(this:  { new (...args: any[]): T; _ins?: T }, params?: any): T {
//         let Class: any = this;
//         if (Class._ins == null) {
//             Class._ins = new Class(params);
//         }
//         return Class._ins ;
//     }

// }

// export class Singleton{
//     protected constructor(){};

//     private static _instance:any = null;

//     protected static GetInstance<T>():T{
//         if (this._instance == null) {
//             this._instance = new this();
//         }
//         return this._instance;
//     }

// }

/**
 * 单例基类
 * @returns 创建一个单例基类返回继承
 */
export function Singleton<T>() {
    class SingletonT {
        protected constructor() {}
        private static _ins: SingletonT = null;
        public static GetIns(): T {
            if (SingletonT._ins == null) {
                SingletonT._ins = new this();
            }
            return SingletonT._ins as T;
        }

        public static ResetIns(): void {
            if (SingletonT._ins != null) {
                SingletonT._ins = null;
            }
        }
    }
    return SingletonT;
}









