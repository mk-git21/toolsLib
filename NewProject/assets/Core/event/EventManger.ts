
import { Singleton } from '../base/Singleton';



export class EventManger extends Singleton {
    
    /**事件存储 */
    eventDir:Map<string,Array<EventItem>> = new Map();

    On()
}

interface EventItem{
    fun:Function,
    ctx:unknown
}

