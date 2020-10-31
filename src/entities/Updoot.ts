import { User } from "./User";
import { ObjectType, Field } from "type-graphql";
import { BaseEntity, PrimaryColumn, Entity, ManyToOne, Column } from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value: number;

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots)
  user: User;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field()
  @ManyToOne(() => Post, (post) => post.updoots, {
    //cascade way to delete all doots when a post is deleted
    onDelete: "CASCADE",
  })
  post: Post;
}
