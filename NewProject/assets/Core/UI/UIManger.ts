
import { Singleton } from '../base/Singleton';
import { ResManger } from '../res/ResManger';

export class UIManger extends Singleton<UIManger>() {
    
private o(){
    ResManger.GetIns()
}
}


