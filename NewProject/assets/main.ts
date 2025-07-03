import { _decorator, Component, director, Node, Scene } from 'cc';
import { UIManger } from './Core/ui/UIManger';
import { GamePage } from './page/Game/GamePage';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    start() {
        UIManger.GetIns().InitConfig(director.getScene().getChildByName("UI"));
        UIManger.GetIns().ShowUI(GamePage.Path);
    }

    update(deltaTime: number) {
        
    }
}


