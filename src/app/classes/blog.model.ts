import { IBlog } from '../interfacecs/blog.interface';

export class Blog implements IBlog {
    constructor(
        public id: string,
        public title: string,
        public text: string,
        public date: string,
        public author: string,
        public image: string
    ){}
    
}
