import { Component, Node } from "cc";
import { ViewType } from "../../enum/coreEnum";
import { EventItem, EventManger } from "../../event/EventManger";

export abstract class BaseView extends Component {
    /**页面类型 */
    public abstract viewType: ViewType;

    /**预加载方法，与mgr协作 */
    public async PreLoad(...args: any[]): Promise<void> { };
    /**初始化页面 */
    public InitView(...args: any[]): void { };
    /**注册监听等事件 */
    public AddEvent(): void { };

    /**界面初始化标识 */
    protected initBool: boolean = false;
    /**快捷访问节点 */
    protected view: { [key: string]: Node } = {};
    /**ui注册事件存储 */
    private eventList: EventItem[] = [];

    protected onLoad(): void {
        this.view = {};
        this.SetViewNode(this.node, "");
        this.AddEvent();
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

    private RemoveAllEvent() {
        for(let event of this.eventList){
            this.RemoveEvent(event);
        }
    }

    /**
     * 移除注册的事件
     * @param event 
     */
    public RemoveEvent(event:EventItem){
        
        EventManger.GetIns().
    }


} 