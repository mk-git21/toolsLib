import { __private, _decorator, assert, Asset, AssetManager, assetManager, SpriteAtlas, SpriteFrame } from 'cc';
import { Singleton } from '../base/Singleton';
const { ccclass, property } = _decorator;


@ccclass('ResManger')
export class ResManger extends Singleton<ResManger>() {

    /**资源缓存记录<uuid,引用次数>*/
    private _assetCache: Map<string, number> = new Map();
    /**记录资源与页面的缓存映射（随页面销毁清除数据）prefab:uuid */
    private _uiResKeys: { [prefabSign: string]: Set<string> } = {};

    /**
     * 用于加载直接获取的资源,如没有打图集的图片
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
        return this.LoadResource(bundleName, resUrl, assetType, onSucc, target, prefabSign);
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
        return this.LoadResource(bundleName, atlasUrl, SpriteAtlas, (asset: SpriteAtlas) => {
            if (onSucc) {
                onSucc.apply(target, [asset.getSpriteFrame(spriteName)]);
            }
        }, target, prefabSign).then((asset: SpriteAtlas) => {
            return asset.getSpriteFrame(spriteName);
        });
    }

    /**
     * 加载资源
     * @param bundleName 
     * @param resUrl 
     * @param assetType 
     * @param onSucc 
     * @param target 
     */
    public async LoadResource<T extends Asset>(
        bundleName: string,
        resUrl: string,
        assetType: { new(...args: any[]): T } | null,
        onSucc: Function,
        target: unknown,
        prefabSign: string,
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            // 加载资源
            let bundleFun = (err: Error, bundle: AssetManager.Bundle) => {
                if (err || !bundle) {
                    reject(err);
                }
                bundle.load(resUrl, assetType, (err: Error, asset: T) => {
                    if (err) {
                        reject(err);
                    }
                    if (onSucc) {
                        onSucc.apply(target, [asset]);
                    }
                    //设置缓存记录
                    this.SetCacheRecord(asset, prefabSign);
                    // this.resLoadSucc(cacheItem, prefabSign);
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
     * @param asset 
     * @param prefabSign 
     */
    private SetCacheRecord(asset: Asset, prefabSign: string) {
        //获取当前ui页面已经加载的资源uuid
        //初始化
        if (!this._uiResKeys[prefabSign]) {
            this._uiResKeys[prefabSign] = new Set<string>();
        }
        let resKeys = this._uiResKeys[prefabSign];
        if (resKeys && resKeys.has(asset.uuid)) return;

        this._uiResKeys[prefabSign].add(asset.uuid);

        //资源当前的引用计数
        let curCount = this._assetCache.get(asset.uuid) ?? 0;
        this._assetCache.set(asset.uuid, curCount + 1);
        asset.addRef();
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
                let curCount = this._assetCache.get(assetKey) ?? 0;
                this._assetCache.set(assetKey, curCount - 1);
                if (curCount - 1 <= 0) {
                    this._assetCache.delete(assetKey);
                }
                //获取当前引擎管理的缓存资源
                let cacheAsset = assetManager.assets.get(assetKey);
                if (cacheAsset) {
                    cacheAsset.decRef();
                }
            }
            delete this._uiResKeys[uisign];
        }
    }
}


