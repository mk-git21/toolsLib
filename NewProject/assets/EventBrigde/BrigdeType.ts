import { B_BattleType } from "./BrigdeEnum"

/**战斗配置 */
export type B_BattleCfg ={
    /**战斗类型 */
    battleType:B_BattleType,
    /**关卡 */
    level?:number,
}

