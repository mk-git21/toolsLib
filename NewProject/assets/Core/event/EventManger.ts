
import { Singleton } from '../base/Singleton';



export class EventManger extends Singleton {

    /**事件存储 */
    eventDir: Map<string, Array<EventItem>> = new Map();

    On(eventKey: string, eventFun: Function, ctx: unknown) {
        if (this.eventDir.has(eventKey)) {
            this.eventDir.get(eventKey).push({ fun: eventFun, ctx: ctx });
        } else {
            this.eventDir.set(eventKey, [{ fun: eventFun, ctx: ctx }]);
        }
    }

    Once(eventKey: string, eventFun: Function, ctx: unknown) {
        if (this.eventDir.has(eventKey)) {
            this.eventDir.get(eventKey).push({ fun: eventFun, ctx: ctx, once: true });
        } else {
            this.eventDir.set(eventKey, [{ fun: eventFun, ctx: ctx, once: true }]);
        }
    }

    /**
     * 注销事件，如果没有传入ctx整个eventKey的全部注销
     * @param eventKey 
     * @param ctx 
     * @returns 
     */
    Off(eventKey: string, ctx: unknown = null) {
        if (!this.eventDir.has(eventKey)) return;

        if (ctx) {
            let eventItems: EventItem[] = this.eventDir.get(eventKey);
            for (let i = eventItems.length - 1; i >= 0; i--) {
                let item: EventItem = eventItems[i];
                if (item.ctx === ctx) {
                    eventItems.splice(i, 1);
                }
            }
            if (eventItems.length <= 0) {
                delete this.eventDir[eventKey];
            }
        } else {
            delete this.eventDir[eventKey];
        }
    }

    Emit(eventKey: string, ...args: any[]) {
        let eventItems: EventItem[] = this.eventDir.get(eventKey);
        if (!eventItems) return;
        for (let i = eventItems.length - 1; i >= 0; i++) {
            let event = eventItems[i];
            event.fun.apply(event.ctx, args);
            if (event.once) {
                eventItems.splice(i, 1);
            }
            if (eventItems.length <= 0) {
                delete this.eventDir[eventKey];
            }
        }
    }

    Clear() {
        this.eventDir.clear();
    }
}

export interface EventItem {
    fun: Function,
    ctx: unknown,
    once?: boolean
}

