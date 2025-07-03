import { __private, _decorator, assert, Asset, AssetManager, assetManager } from 'cc';
import { Singleton } from '../base/Singleton';
const { ccclass, property } = _decorator;

/**当前页面缓存的资源实体 */
class CacheAssetItem {
    /**所在的包名**/
    bundleName: string;
    /**相对路径 */
    resUrl: string;
    /**资源类型 */
    assetType: { new(...args: any[]): Asset } | null;
    /**资源 */
    asset?: Asset;
    /**页面标识 */
    prefabSign: string;

    constructor(data: {
        bundleName: string,
        resUrl: string,
        assetType: { new(...args: any[]): Asset } | null,
        asset?: Asset;
        prefabSign: string
    }) {
        this.bundleName = data.bundleName;
        this.resUrl = data.resUrl;
        this.assetType = data.assetType;
        this.prefabSign = data.prefabSign;
        this.asset = data.asset;
    }

    /**比较要加载的资源是否同一个 */
    compare(other: CacheAssetItem): boolean {
        return this.bundleName === other.bundleName && this.resUrl === other.resUrl && this.assetType === other.assetType;
    }
}
@ccclass('ResManger')
export class ResManger extends Singleton<ResManger>() {

    /**记录预制体使用的动态资源（随页面销毁清除数据） */
    private _uiWithAsset: { [prefabSign: string]: CacheAssetItem[] } = {};

    /**
     * 统用加载资源,用于加载直接获取的资源,如没有打图集的图片
     * @param bundleName 
     * @param resUrl 
     * @param assetType 
     * @param onSucc 
     * @param target 
     */
    public async LoadResByUrl(
        bundleName: string,
        resUrl: string,
        assetType: { new(...args: any[]): Asset } | null,
        onSucc: Function,
        target: unknown,
        prefabSign: string,
    ): Promise<Asset> {
        //提前创建当前资源类实例
        let cacheItem: CacheAssetItem = new CacheAssetItem({
            bundleName: bundleName,
            resUrl: resUrl,
            assetType: assetType,
            prefabSign: prefabSign
        })
        //检查是否有缓存可用
        let cacheAssetItem = this.GetCacheItem(cacheItem)
        if (cacheAssetItem) {
            return cacheAssetItem.asset;
        }
        //没有缓存时加载资源
        return await new Promise<Asset>((resolve, reject) => {
            let bundleFun = (err: Error, bundle: AssetManager.Bundle) => {
                if (err || !bundle) {
                    reject(err);
                    return null
                }
                bundle.load(resUrl, assetType, (err: Error, asset: Asset) => {
                    if (err) {
                        reject(err);
                        return null
                    }
                    if (onSucc) {
                        onSucc.apply(target, [asset]);
                    }
                    cacheItem.asset = asset
                    this.resLoadSucc(cacheItem, prefabSign);
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
     * 动态资源加载完成后记录资源类和引用次数
     * @param CacheAssetItem 
     */
    public resLoadSucc(cacheItem: CacheAssetItem, prefabSign: string): void {
        //记录资源
        let uiAssets = this._uiWithAsset[prefabSign];
        if (!uiAssets) {
            uiAssets = [];
            this._uiWithAsset[prefabSign] = uiAssets;
        }
        uiAssets.push(cacheItem);
        //增加计数
        cacheItem.asset.addRef();
    }

    /**
     * 释放对应ui的动态加载资源
     * @param uisign 
     */
    public ReleaseUIRes(uisign: string) {
        let uiAssets = this._uiWithAsset[uisign];
        if (uiAssets) {
            for (let i = uiAssets.length - 1; i >= 0; i--) {
                if (uiAssets[i]?.asset) {
                    uiAssets[i].asset.decRef()
                }
                delete uiAssets[i];
            }
        }
    }

    /**
     * 从当前的加载的缓存中获取资源
     * @param cacheItem 
     */
    private GetCacheItem(cacheItem: CacheAssetItem): CacheAssetItem | null {
        this._uiWithAsset[cacheItem.prefabSign]?.forEach((item) => {
            if (item.compare(cacheItem)) {
                return item;
            }
        });
        return null;
    }
}


