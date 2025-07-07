import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { BaseView } from '../../Core/ui/uiBase/BaseView';
import { ViewType } from '../../Core/enum/CoreEnum';
import { ResManger } from '../../Core/res/ResManger';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BaseView {
    //页面参数初始化
    public viewType: ViewType = ViewType.Page;
    public static Path: string = "Game:GamePage";

    public InitView(...args: any[]): void {

    }

    public RegisterEvent(): void {
        this.AddButtonByCom("_Button1", (() => {
            this.onClose()
        }), this)
        this.AddButtonByCom("_Button2", this.changeSprite, this)
        this.AddButtonByCom("_Button3", this.checkResolve, this)
        this.AddButtonByCom("_Button4", this.checkReject, this)
    }
    private clickNum: number = 0;
    async changeSprite() {
        this.clickNum++;
        if (this.clickNum % 2 == 0) {
            let sprite = this._getCompont("_sprite", Sprite);
            ResManger.GetIns().LoadSpriteFrameInAtlas("Game", "res/texture", "R-C", ((asset: SpriteFrame) => {
                sprite.spriteFrame = asset;
            }), this, this.uiSign);
        } else {
            let sprite = this._getCompont("_sprite", Sprite);
            ResManger.GetIns().LoadSpriteFrameInAtlas("Game", "res/texture", "R-C (1)", ((asset: SpriteFrame) => {
                sprite.spriteFrame = asset;
            }), this, this.uiSign);
        }

    }

    async checkResolve() {
        let str =await  new Promise((resolve, reject) => {
            resolve("成功checkResolve");
            console.log("成功");
        }).then()
        console.log("打印"+str);
        
    }

    async checkReject() {
        let str = await new Promise((resolve, reject) => {
            reject("失败");
            console.log("失败");
            resolve("成功");
            console.log("成功");
        }).catch()
        console.log("打印"+str);

    }

}


