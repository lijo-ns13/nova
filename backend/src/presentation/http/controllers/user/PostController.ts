import {
  controller,
  httpPost,
  httpGet,
  httpDelete,
  request,
  response,
  requestParam,
} from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../../di/types";
import { IPostService } from "../../../../core/interfaces/services/Post/IPostService";
import { IPostController } from "../../../../core/interfaces/controllers/post/IPostController";
import { ILikeService } from "../../../../core/interfaces/services/Post/ILikeService";
import { ICommentService } from "../../../../core/interfaces/services/ICommentService";
interface Userr {
  id: string;
  email: string;
  role: string;
}

@injectable()
export class PostController implements IPostController {
  constructor(
    @inject(TYPES.PostService) private _postService: IPostService,
    @inject(TYPES.LikeService) private _likeService: ILikeService,
    @inject(TYPES.CommentService) private _commentService: ICommentService
  ) {}

  public async create(req: Request, res: Response) {
    try {
      const { description } = req.body;
      console.log("req.body in post contorler", req.body);
      const creatorId = (req.user as Userr)?.id;
      const mediaFiles = req.files as Express.Multer.File[];
      console.log("Media files in post contorller", mediaFiles, creatorId);
      const post = await this._postService.createPost(
        creatorId,
        description,
        mediaFiles
      );

      return res.status(201).json(post);
    } catch (err: any) {
      return res.status(500).json({ error: err.message, how: "lksjfls" });
    }
  }
  async getPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const post = await this._postService.getPost(postId);
      return res.status(200).json({ success: true, post: post });
    } catch (error: any) {
      return res.status(500).json({ error: error.message, how: "lksjfls" });
    }
  }
  async getAllPost(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await this._postService.getAllPost(page, limit);
      return res.status(200).json(posts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message, how: "lksjfls" });
    }
  }
  async likeOrUnlikePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = (req.user as Userr)?.id;

      const result = await this._likeService.likeOrUnlikePost(postId, userId);

      return res.status(200).json({
        message: result.liked ? "Post liked" : "Post unliked",
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getLikesForPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const likes = await this._likeService.getLikesForPost(postId);

      return res.status(200).json({ likes });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  // comment related
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId, content, parentId, authorName } = req.body;
      const authorId = (req.user as Userr)?.id; // Assuming user is authenticated
      // Assuming user has name property

      const comment = await this._commentService.createComment(
        postId,
        authorId,
        authorName,
        content,
        parentId
      );

      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPostComments(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._commentService.getCommentsByPostId(
        postId,
        page,
        limit
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
