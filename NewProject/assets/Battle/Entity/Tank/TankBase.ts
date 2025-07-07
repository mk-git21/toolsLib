import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TankBase')
export class TankBase  {
     /**战车id */
    private _id: number = 0;
    /**战车基础血量 */
    private _baseHp: number = 100;
    // /**战车装甲血量 */
    // private _armorHp: number = 0;
    /**战车防御力 */
    private _defense: number = 0;

    /**战车武器 */
    private _weaponList: TankWeapon[] = [];

    public setBaseHp(curBaseHp: number) {
        this._baseHp = curBaseHp;
    }

    // public setArmorHp(curArmorHp: number) {}

    public setDefense(curDefense: number) {
        this._defense = curDefense;
    }

    public setWeaponList(weapon: TankWeapon) {
        this._weaponList.push(weapon);
    }

    public get weaponList(): TankWeapon[] {
        return this._weaponList;
    }

    public get id(): number {
        return this._id;
    }

    public get baseHp(): number {
        return this._baseHp;
    }

    // public get armorHp(): number {
    //     return this._armorHp;
    // }

    public get defense(): number {
        return this._defense;
    }

    // /**获取装甲血量和基础血量总和 */
    // public get allHp(): number {
    //     return this._baseHp + this._armorHp;
    // }

    constructor(id: number, baseHp: number, defense: number) {
        this._id = id;
        this._baseHp = baseHp;
        // this._armorHp = armorHp;
        this._defense = defense;
    }
}

/**战车武器结构 */
class TankWeapon {
    /**武器id 代表对应的炮台位置 */
    private _id: number = 0;
    /**武器基础伤害 */
    private _baseDamage: number = 0;
    /**武器攻击间隔 */
    private _attackInterval: number = 0;
    /**武器攻击范围 */
    private _attackRange: number = 0;
    /**武器状态 */
    private _curState: WeaponState = WeaponState.Idle;
    /**武器子弹上限 */
    private _bulletLimitNum: number = 0;
    /**武器子弹数量 */
    private _curButtletNum: number = 0;

    public setCurState(curState: WeaponState) {
        this._curState = curState;
    }

    public setCurButtletNum(curButtletNum: number) {
        this._curButtletNum = curButtletNum;
    }

    public setCurWeaponState(curState: WeaponState) {
        this._curState = curState;
    }

    public get id(): number {
        return this._id;
    }

    public get baseDamage(): number {
        return this._baseDamage;
    }

    public get attackInterval(): number {
        return this._attackInterval;
    }

    public get attackRange(): number {
        return this._attackRange;
    }

    public get curState(): WeaponState {
        return this._curState;
    }

    public get bulletLimitNum(): number {
        return this._bulletLimitNum;
    }

    public get curButtletNum(): number {
        return this._curButtletNum;
    }

    public get isCanAttack(): boolean {
        return this._curState == WeaponState.Idle && this._curButtletNum > 0;
    }

    constructor(id: number, baseDamage: number, attackInterval: number, attackRange: number, bulletLimitNum: number) {
        this._id = id;
        this._baseDamage = baseDamage;
        this._attackInterval = attackInterval;
        this._attackRange = attackRange;
        this._bulletLimitNum = bulletLimitNum;
    }
}

enum WeaponState {
    Idle = 0,
    Attack,
}


