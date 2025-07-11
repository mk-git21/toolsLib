import { _decorator } from 'cc';
import { BattleType } from '../BattleType';
import { BattleCore } from './BattleCore';
const { ccclass } = _decorator;

@ccclass('BattleEnter')
export class BattleEnter {
    private _battleCore:BattleCore;

    /**
     * 战斗初始化
     * @param battleType 
     * @param missionCfg 关卡配置
     */
    public InitBattle(battleType:BattleType,missionCfg?:any){
        //初始化战斗
        this._battleCore = new BattleCore();
        this._battleCore.InitCore(battleType,missionCfg);
        
    }
}


