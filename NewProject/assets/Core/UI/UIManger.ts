
import { error, instantiate, Node, ParticleAsset, Prefab, View } from 'cc';
import { Singleton } from '../base/Singleton';
import { ResManger } from '../res/ResManger';
import { BaseView } from './uiBase/BaseView';
import { ViewType } from '../enum/CoreEnum';

export class UIManger extends Singleton<UIManger>() {

    /**记录层级对应的父节点 */
    private viewNodeRecord: Partial<Record<ViewType, Node>>;
    /**记录当前ui根节点 */
    private rootNode: Node;

    /**正在打开的ui */
    private _openingUI: string[] = [];
    /**正在显示的ui */
    private _showingUI: { [uisign: string]: Node } = {};
    /**正在隐藏的ui */
    private _hidingUI: { [uisign: string]: Node } = {};

    /**初始化UIManager配置，在场景切换时调用 */
    public InitConfig(uiNode: Node) {
        this.rootNode = uiNode;
        //初始化层级
        this.viewNodeRecord = {};
        for (let type in ViewType) {
            this.viewNodeRecord[type] = uiNode.getChildByName("layer_" + type.toString());
        }
    }

    /**
     * 打开ui
     * @param uiPath 
     * @param args 
     * @param callBack 
     * @param callBackTarget 
     */
    public async ShowUI(
        uiPath: string,
        args: any = null,
        callBack: Function = null,
        callBackTarget: unknown = null,
    ): Promise<Node> {
        const [bundleName, resUrl] = uiPath.split(":");
        let resArr = resUrl.split("/");
        let prefabSign = resArr[resArr.length - 1];
        //ui正在开启中
        if (this._openingUI.indexOf(prefabSign) != -1) {
            return
        }
        this._openingUI.push(prefabSign);
        //加载ui预制
        let uiPrefab: Prefab = await ResManger.GetIns().LoadResByUrl(bundleName, resUrl, Prefab, null, this, prefabSign) as Prefab;
        if (!uiPrefab) {
            console.error("UI预制体加载失败" + uiPath);
            return
        }
        //设置ui父节点后初始化
        let uiNode = instantiate(uiPrefab);
        let uiCom = uiNode.addComponent(prefabSign) as BaseView;
        let viewType = uiCom.viewType;
        uiNode.setParent(this.viewNodeRecord[viewType]);
        //初始化
        uiCom.uiSign = prefabSign;
        await uiCom.PreLoad(args);
        uiCom.InitView(args);
        //从正在开启中删掉
        this._openingUI.splice(this._openingUI.indexOf(prefabSign), 1);
        this._showingUI[prefabSign] = uiNode;
        //打开Ui后的回调
        if (callBack) {
            callBack.apply(callBackTarget, [uiNode]);
        }
    }

    /**
     * 关闭指定标识的UI界面
     * @param uiSign - 需要关闭的UI标识符（通常为UI资源路径或唯一名称）
     * @param isDestroy - 是否销毁UI对象（默认true：销毁；false：仅隐藏）
     * @param callBack - UI关闭后执行的回调函数（可选，默认null）
     * @param callBackTarget - 回调函数的执行上下文对象（可选，默认null）
     */
    public CloseUI(uiSign: string, isDestroy: boolean = true, callBack: Function = null, callBackTarget: unknown = null) {
        let uiNode = this._showingUI[uiSign];
        if (!uiNode) return;

        if (!isDestroy) {
            uiNode.active = false;
            this._hidingUI[uiSign] = uiNode;
        } else {
            uiNode.destroy();
            delete this._showingUI[uiSign];
            ResManger.GetIns().ReleaseUIRes(uiSign);
        }
    }

}


