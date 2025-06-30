import { _decorator, Asset, assetManager, Component, Node } from 'cc';
import { Singleton } from '../base/Singleton';
const { ccclass, property } = _decorator;

@ccclass('ResManger')
export class ResManger extends Singleton<ResManger>() {
    
    /**资源加载计数 */
    private _resourceCount:{[assUuid:string]:number} = {};
    


    public release(asset:Asset){
        let uuid = asset.uuid;
        let curCount = this._resourceCount[uuid]||0;
        if (curCount > 0) {
            this._resourceCount[uuid]--;
        }else{
            assetManager.releaseAsset(asset);
            delete this._resourceCount[uuid];
        }

    }
}


