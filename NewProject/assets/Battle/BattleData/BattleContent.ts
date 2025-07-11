import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BattleContent')
export class BattleContent  {
    /**实体组 */
    private _entityMap: Map<number, Entity> = new Map();
    
}


