export class Message {

  constructor(public author: string, public content: string){}

  id: string
  createdAt: Date
  updatedAt: Date
}
