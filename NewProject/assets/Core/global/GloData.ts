import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GloData')
export class GloData  {
    
    /**游戏逻辑帧率 */
    public static GAME_FPS:number = 30;
}


