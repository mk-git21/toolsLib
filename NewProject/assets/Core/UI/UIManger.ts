
import { error, instantiate, ParticleAsset, Prefab } from 'cc';
import { Singleton } from '../base/Singleton';
import { ResManger } from '../res/ResManger';

export class UIManger extends Singleton<UIManger>() {


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
        //加载ui预制
        let uiPrefab: Prefab = await ResManger.GetIns().LoadResByUrl<Prefab>(bundleName, resUrl, Prefab, null, this, prefabSign);
        if (!uiPrefab) {
            console.error("UI预制体加载失败"+uiPath);
            return
        }
        let uiNode = instantiate(uiPrefab);
        let uiCom =  uiNode.addComponent(prefabSign);
        uiCom.initVie
    }
}


