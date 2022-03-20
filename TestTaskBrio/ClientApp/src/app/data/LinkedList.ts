export class LinkedListNode {
    public elem;
    public next:any;

    constructor(elem:any,next = null) {
        this.elem = elem;
        this.next = next;
    }
}


export class LinkedList { 
    private head:any = null;
    public length = 0;

    getLength(){
        return this.length;
    }

    public append(elem:any) {
        let node = new LinkedListNode(elem);
        let current;

        if (this.head === null) {
            this.head = node;
        } else {
            current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.length++;
    }

    public removeAt(pos:number) {
        if (pos > -1 && pos < this.length) {
            let current = this.head;
            let previous:any;
            let index = 0;

            if (pos === 0) {
                this.head = current.next;
            } else {
                while (index++ < pos) {
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            this.length--;
            return current.elem;
        } else {
            return null;
        }
    }


    public insert(elem:any, pos:number) {
        if (pos > -1 && pos < this.length) {
            let current = this.head;
            let index = 0;
            let previous:any;
            let node = new LinkedListNode(elem);

            if (pos === 0) {
                node.next = current;
                this.head = node;
            } else {
                while (index++ < pos) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true;
        } else {
            return false;
        }
    }
    find(index:number){
        let result:LinkedListNode = this.head;
        while(index-- && result) 
        {
            result = result.next;
        }
        return result;
    }
}


