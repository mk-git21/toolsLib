import { Component } from "cc";
import { ViewType } from "../../enum/coreEnum";

export abstract class BaseView extends Component{
    /**页面类型 */
    public abstract viewType:ViewType;

    /**预加载方法，与mgr协作 */
    public async PreLoad(...args:any[]):Promise<void>{};
    /**初始化页面 */
    public InitView(...args:any[]):void{};
    /**注册监听等事件 */
    public AddEvent():void{};
} 