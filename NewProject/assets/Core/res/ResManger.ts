import { __private, _decorator, assert, Asset, AssetManager, assetManager } from 'cc';
import { Singleton } from '../base/Singleton';
const { ccclass, property } = _decorator;

@ccclass('ResManger')
export class ResManger extends Singleton<ResManger>() {

    /**资源加载计数 */
    private _resourceCount: { [assUuid: string]: number } = {};
    /**记录预制体使用的动态资源（随页面销毁清除数据） */
    private _uiWithAsset: { [prefabSign: string]: Asset[] } = {};

    /**
     * 加载资源
     * @param bundleName 
     * @param resUrl 
     * @param assetType 
     * @param onSucc 
     * @param target 
     */
    public async LoadResByUrl<T extends Asset>(
        bundleName: string,
        resUrl: string,
        assetType: { new(...args: any[]): T } | null,
        onSucc: Function,
        target: unknown,
        prefabSign: string,
    ): Promise<T> {
        return await new Promise<T>((resolve, reject) => {
            let bundleFun = (err: Error, bundle: AssetManager.Bundle) => {
                if (err || !bundle) {
                    reject(err);
                    return null
                }
                bundle.load(resUrl, assetType, (err: Error, asset: T) => {
                    if (err) {
                        reject(err);
                        return null
                    }
                    if (onSucc) {
                        onSucc.apply(target, [asset]);
                    }
                    this.resLoadSucc(asset, prefabSign);
                    resolve(asset);
                })
            }
            this.LoadBundle(bundleName, bundleFun, this);
        })
    }

    /**
     * 加载bundle
     * @param bundleName 
     * @param onComplete 
     * @param target 
     * @returns 
     */
    private LoadBundle(bundleName: string, onComplete: Function, target: unknown): void {
        //先查看目前有没有bundle
        let bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            onComplete.apply(target, [null, bundle]);
            return
        }
        assetManager.loadBundle(bundleName, null, ((err, bundle) => {
            if (err) {
                console.error("bundle加载失败：" + bundleName);
            }
            onComplete.apply(target, [err, bundle])
        }))
    }


    /**
     * 动态资源加载完成后记录uuid和引用次数
     * @param asset 
     */
    public resLoadSucc(asset: Asset, prefabSign: string): void {
        let uuid = asset.uuid;
        if (uuid in this._resourceCount) {
            this._resourceCount[uuid]++;
        } else {
            this._resourceCount[uuid] = 1;
        }
        //记录资源
        let uiAssets = this._uiWithAsset[prefabSign];
        if (!uiAssets) {
            uiAssets = [];
            this._uiWithAsset[prefabSign] = uiAssets;
        }
        uiAssets.push(asset);
    }

    /**
     * 资源释放
     * @param asset 
     */
    public release(asset: Asset): void {
        let uuid = asset.uuid;
        let curCount = this._resourceCount[uuid] || 0;
        if (curCount > 1) {
            this._resourceCount[uuid]--;
        } else {
            assetManager.releaseAsset(asset);
            delete this._resourceCount[uuid];
        }
    }
}


