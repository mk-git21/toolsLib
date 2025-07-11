import { _decorator } from 'cc';
import { Singleton } from '../../Core/base/Singleton';
import { BattleEnter } from './BattleEnter';
import { B_BattleCfg } from '../../EventBrigde/BrigdeType';
import { B_BattleType } from '../../EventBrigde/BrigdeEnum';
import { BattleType } from '../BattleType';
const { ccclass, property } = _decorator;

//处理战斗外部需要处理的事情
@ccclass('BattleGame')
export class BattleGame extends Singleton<BattleGame>() {

    private _battleEnter: BattleEnter = new BattleEnter();

    /**
     * 初始化战斗配置
     */
    public InitBallteCfg(battleCfg: B_BattleCfg): void {
        /**关卡配置 */
        let missionCfg;
        if (battleCfg.battleType == B_BattleType.Normal) {
            let battleLevel = battleCfg.level;
            // missionCfg = 
        } else {
            // missionCfg =
        }

        this._battleEnter.InitBattle(battleCfg.battleType as number, missionCfg);
    }
}


