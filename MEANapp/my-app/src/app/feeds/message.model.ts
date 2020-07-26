export class Message {

  constructor(public author: string, public content: string){}

  id: string
  sprite: string
  createdAt: Date
  updatedAt: Date
}
