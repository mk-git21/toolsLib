import { _decorator, Component, Node } from 'cc';
import { BaseView } from '../../Core/ui/uiBase/BaseView';
import { ViewType } from '../../Core/enum/CoreEnum';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BaseView {
    //页面参数初始化
    public viewType: ViewType = ViewType.Page;
    public static Path: string = "Game:GamePage";
    

}


