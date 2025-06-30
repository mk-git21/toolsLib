import { Button, Component, Label, Node, Sprite } from "cc";
import { ViewType } from "../../enum/CoreEnum";
import { EventItem, EventManger } from "../../event/EventManger";

export abstract class BaseView extends Component {
    /**页面类型 */
    public abstract viewType: ViewType;

    /**预加载方法，与mgr协作 */
    public async PreLoad(...args: any[]): Promise<void> { };
    /**初始化页面 */
    public InitView(...args: any[]): void { };
    /**注册监听等事件 */
    public RegisterEvent(): void { };

    /**界面初始化标识 */
    protected initBool: boolean = false;
    /**快捷访问节点 */
    protected view: { [key: string]: Node } = {};
    /**ui注册事件存储 */
    private eventList: EventItem[] = [];

    protected onLoad(): void {
        this.view = {};
        this.SetViewNode(this.node, "");
        this.RegisterEvent();
        this.initBool = true;
    }

    protected onDestroy(): void {
        this.RemoveAllEvent();
    }

    /**
     * 获取带_的节点用来快速访问
     */
    protected SetViewNode(root: Node, path: string): void {
        for (let i = 0; i < root.children.length; i++) {
            let childNode = root.children[i];
            let childName = childNode.name;

            if (childName.charAt(0) != "_") continue;

            if (this.view[childName] != undefined) {
                console.error("页面节点View重复命名", path + childName);
                continue;
            }

            this.view[childName] = childNode;
            if (childNode.children.length > 0) {
                this.SetViewNode(childNode, path + childName + "/")
            }
        }
    }

    //region 事件处理

    protected AddEvent(eventKey: string, fun: Function, ctx: unknown, once: boolean = false): void {
        if (once) {
            EventManger.GetIns().Once(eventKey, fun, ctx);
        } else {
            EventManger.GetIns().On(eventKey, fun, ctx);
        }
    }

    private RemoveAllEvent(): void {
        for (let event of this.eventList) {
            this.RemoveEvent(event);
        }
    }

    /**
     * 移除注册的事件
     * @param event 
     */
    public RemoveEvent(event: EventItem): void {
        EventManger.GetIns().Off(event.eventName, this);
    }

    //#endregion

    //region 按钮事件绑定
    /**
     * 按钮事件绑定,节点要有按钮组件
     * @param viewName string|Node
     * @param fun 
     * @param target 
     */
    protected AddButtonByCom(viewName: string|Node, fun: Function, target: unknown): void {
        let buttonCom = this._getCompont(viewName,Button);
        // let node = this.view[viewName];
        // if (!node) {
        //     console.error("按钮绑定没有找到对应节点：" + `AddButtonByCom:${viewName}`);
        //     return
        // }

        // let buttonCom = node.getComponent(Button);
        // if (!buttonCom) {
        //     console.error("按钮没有挂载按钮组件：" + `AddButtonByCom:${viewName}`);
        //     return
        // }
        let node = buttonCom.node;
        node.off(Button.EventType.CLICK);
        node.on(Button.EventType.CLICK, fun, target);
    }
    //#endregion

    //#region 辅助方法
    /**
     * 设置文本标签
     * @param viewName string|Node
     * @param str 
     */
    protected setLabel(viewName: string|Node, str: string): void {
        let labelCom = this._getCompont(viewName,Label);
        labelCom.string = str;
    }

    /**
     * 获取组件
     * @param target 
     * @param compont 
     * @param autoAdd 
     * @returns 
     */
    protected _getCompont<T extends Component>(target: string | Node, compont: new () => T, autoAdd: boolean = false): T | null {
        let targetCom: T = null;
        let targetNode: Node = null;

        if (typeof target === "string") {
            targetNode = this.view[target];
        } else if (target instanceof Node) {
            targetNode = target;
        }

        if (!targetNode) {
            console.error("获取组件未找到节点" + target);
            return null;
        }
        //是否要添加
        targetCom = targetNode.getComponent(compont);
        if (!targetCom && autoAdd) {
            targetCom = targetNode.addComponent(compont);
        }
        return targetCom;
    }


} 