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
    }
    private clickNum: number = 0;
    async changeSprite() {
        this.clickNum++;
        if (this.clickNum % 2 == 0) {
            let sprite = this._getCompont("_sprite", Sprite);
            const asset = await ResManger.GetIns().LoadResByUrl("Game", "res/R-C/spriteFrame", SpriteFrame, null, null, this.uiSign);
            sprite.spriteFrame = asset as SpriteFrame;
        } else {
            let sprite = this._getCompont("_sprite", Sprite);
            const asset = await ResManger.GetIns().LoadResByUrl("Game", "res/R-C1/spriteFrame", SpriteFrame, null, null, this.uiSign);
            sprite.spriteFrame = asset as SpriteFrame;
        }

    }

}


