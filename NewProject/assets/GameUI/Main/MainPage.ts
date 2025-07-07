import { _decorator, Component, Node } from 'cc';
import { BaseView } from '../../Core/ui/uiBase/BaseView';
import { ViewType } from '../../Core/enum/CoreEnum';
const { ccclass, property } = _decorator;

@ccclass('MainPage')
export class MainPage extends BaseView {
    public viewType: ViewType = ViewType.Page;
   
}


