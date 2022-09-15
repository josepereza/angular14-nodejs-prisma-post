export interface User {
    id:    number;
    email: string;
    name:  string;
    posts: Post[];
}

export interface Post {
    id?:        number;
    title:     string;
    content:   null | string;
    published?: boolean;
    authorId?:  number;
    authorEmail?:string;
}