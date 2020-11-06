import { User } from "./User";
import { ObjectType } from "type-graphql";
import { BaseEntity, PrimaryColumn, Entity, ManyToOne, Column } from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    //cascade way to delete all doots when a post is deleted
    onDelete: "CASCADE",
  })
  post: Post;
}
