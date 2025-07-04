import { __private, _decorator, assert, Asset, AssetManager, assetManager, SpriteAtlas, SpriteFrame } from 'cc';
import { Singleton } from '../base/Singleton';
const { ccclass, property } = _decorator;

/**当前系统缓存的资源实体 */
class CacheAssetItem {
    /**所在的包名**/
    bundleName: string;
    /**相对路径 */
    resUrl: string;
    /**资源类型 */
    assetType: { new(...args: any[]): Asset } | null;
    /**资源 */
    asset?: Asset;

    constructor(data: {
        bundleName: string,
        resUrl: string,
        assetType: { new(...args: any[]): Asset } | null,
        asset?: Asset;
    }) {
        this.bundleName = data.bundleName;
        this.resUrl = data.resUrl;
        this.assetType = data.assetType;
        this.asset = data.asset;
    }

    /**比较要加载的资源是否同一个 */
    compare(other: CacheAssetItem): boolean {
        return this.bundleName === other.bundleName && this.resUrl === other.resUrl && this.assetType === other.assetType;
    }
}
@ccclass('ResManger')
export class ResManger extends Singleton<ResManger>() {

    /**资源缓存记录*/
    private _assetCache: Map<string, CacheAssetItem> = new Map();
    /**记录资源与页面的缓存映射（随页面销毁清除数据） */
    private _uiResKeys: { [prefabSign: string]: Set<string> } = {};

    /**
     * 通用加载资源,用于加载直接获取的资源,如没有打图集的图片
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
        return new Promise<Asset>((resolve, reject) => {
            //提前创建当前资源类实例
            let cacheItem: CacheAssetItem = new CacheAssetItem({
                bundleName: bundleName,
                resUrl: resUrl,
                assetType: assetType,
            })
            //检查是否有缓存可用
            let cacheAssetItem = this.GetAssetFromCache(cacheItem, prefabSign);
            if (cacheAssetItem) {
                if (onSucc) {
                    onSucc.apply(target, [cacheAssetItem.asset]);
                }
                resolve(cacheAssetItem.asset);
                return
            }
            //没有缓存时加载资源
            let bundleFun = (err: Error, bundle: AssetManager.Bundle) => {
                if (err || !bundle) {
                    reject(err);
                }
                bundle.load(resUrl, assetType, (err: Error, asset: Asset) => {
                    if (err) {
                        reject(err);
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
     * 加载图集的图片,此时保存的资源为图集
     * @param bundleName 
     * @param atlasUrl 
     * @param spriteName 
     * @param onSucc 
     * @param target 
     * @param prefabSign
     */
    public async LoadSpriteFrameInAtlas(
        bundleName: string,
        atlasUrl: string,
        spriteName: string,
        onSucc: Function,
        target: unknown,
        prefabSign: string
    ): Promise<SpriteFrame> {
        return await new Promise<SpriteFrame>((resolve, reject) => {
            //提前创建当前资源类实例
            let cacheItem: CacheAssetItem = new CacheAssetItem({
                bundleName: bundleName,
                resUrl: atlasUrl,
                assetType: SpriteAtlas,
            })
            //检查是否有缓存可用
            let cacheAssetItem = this.GetAssetFromCache(cacheItem, prefabSign)
            if (cacheAssetItem) {
                let atlasAsset = cacheAssetItem.asset as SpriteAtlas;
                if (onSucc) {
                    onSucc.apply(target, [atlasAsset.getSpriteFrame(spriteName)]);
                }
                resolve(atlasAsset.getSpriteFrame(spriteName));
                return
            }
            //没有缓存时加载资源
            let bundleFun = (err: Error, bundle: AssetManager.Bundle) => {
                if (err || !bundle) {
                    reject(err);
                    return null
                }
                bundle.load(atlasUrl, SpriteAtlas, (err: Error, asset: SpriteAtlas) => {
                    if (err) {
                        reject(err);
                        return null
                    }
                    if (onSucc) {
                        onSucc.apply(target, [asset.getSpriteFrame(spriteName)]);
                    }
                    cacheItem.asset = asset
                    this.resLoadSucc(cacheItem, prefabSign);
                    resolve(asset.getSpriteFrame(spriteName));
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
        //记录缓存资源
        const assetKey = this.GetResKey(cacheItem);
        this._assetCache.set(assetKey, cacheItem);
        //记录页面映射
        if (!this._uiResKeys[prefabSign]) {
            this._uiResKeys[prefabSign] = new Set<string>();
        }
        this._uiResKeys[prefabSign].add(assetKey);

        //增加计数
        cacheItem.asset.addRef();
    }

    /**
     * 释放对应ui的动态加载资源
     * @param uisign 
     */
    public ReleaseUIRes(uisign: string) {
        //找到页面引用的所有资源
        const assetKeys = this._uiResKeys[uisign];
        if (assetKeys) {
            for (const assetKey of assetKeys) {
                this._assetCache.get(assetKey)?.asset.decRef();
            }
            delete this._uiResKeys[uisign];
        }
    }

    /**
     * 从缓存区获取资源
     * @param cacheItem 
     * @param prefabSign 
     */
    private GetAssetFromCache(cacheItem: CacheAssetItem, prefabSign: string): CacheAssetItem | undefined {
        //先检查是否已经加载过该资源
        const resKey = this.GetResKey(cacheItem);
        let assetItem = this._assetCache.get(resKey);
        if (!assetItem) return undefined;

        //检查页面有没有记录页面的引用
        let resKeys = this._uiResKeys[prefabSign];
        if (!resKeys.has(resKey)) {
            //没有记录要增加引用记录
            resKeys.add(resKey);
            assetItem.asset.addRef();
        }

        return assetItem;
    }

    /**
     * 构造资源唯一Key
     */
    private GetResKey(cacheItem: CacheAssetItem): string {
        return `${cacheItem.bundleName}|${cacheItem.resUrl}|${cacheItem.assetType?.name ?? ""}`;
    }
}


