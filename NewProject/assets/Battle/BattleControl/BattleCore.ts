import { _decorator, Component, Node } from 'cc';
import { BattleType } from '../BattleType';
import { BattleContent } from '../BattleData/BattleContent';
const { ccclass, property } = _decorator;

@ccclass('BattleCore')
export class BattleCore {

    /**上下文 */
    private battleContext:BattleContent;
    
    /**
     * 初始化
     * @param battleType 
     * @param missionCfg 
     */
    public InitCore(battleType:BattleType,missionCfg?:any){
        
    }
}


