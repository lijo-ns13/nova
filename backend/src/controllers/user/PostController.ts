import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../di/types";
import { IPostService } from "../../interfaces/services/Post/IPostService";
import { IPostController } from "../../interfaces/controllers/post/IPostController";
import { ILikeService } from "../../interfaces/services/Post/ILikeService";
import {
  ICommentService,
  ICommentServiceResponse,
} from "../../interfaces/services/ICommentService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
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

  async create(req: Request, res: Response) {
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

      return res.status(HTTP_STATUS_CODES.CREATED).json(post);
    } catch (err) {
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (err as Error).message });
    }
  }
  async getPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const post = await this._postService.getPost(postId);
      return res
        .status(HTTP_STATUS_CODES.OK)
        .json({ success: true, post: post });
    } catch (error) {
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message, how: "lksjfls" });
    }
  }
  async getAllPost(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await this._postService.getAllPost(page, limit);
      return res.status(HTTP_STATUS_CODES.OK).json(posts);
    } catch (error) {
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message, how: "lksjfls" });
    }
  }
  async likeOrUnlikePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = (req.user as Userr)?.id;

      const result = await this._likeService.likeOrUnlikePost(postId, userId);

      return res.status(HTTP_STATUS_CODES.OK).json({
        message: result.liked ? "Post liked" : "Post unliked",
      });
    } catch (error) {
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message });
    }
  }

  async getLikesForPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const likes = await this._likeService.getLikesForPost(postId);

      return res.status(HTTP_STATUS_CODES.OK).json({ likes });
    } catch (error) {
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message });
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

      res.status(HTTP_STATUS_CODES.CREATED).json(comment);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = (req.user as Userr)?.id;

      const updatedComment: ICommentServiceResponse =
        await this._commentService.updateComment(commentId, content, userId);

      res.status(HTTP_STATUS_CODES.OK).json(updatedComment);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = (req.user as Userr)?.id;

      await this._commentService.deleteComment(commentId, userId);
      res
        .status(HTTP_STATUS_CODES.OK)
        .json({ message: "Comment deleted successfully." });
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  }

  async toggleLikeComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = (req.user as Userr)?.id;

      const result: ICommentServiceResponse =
        await this._commentService.toggleLikeComment(commentId, userId);

      res.status(HTTP_STATUS_CODES.OK).json(result);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
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

      res.status(HTTP_STATUS_CODES.OK).json(result);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST)
        .json({ message: (error as Error).message });
    }
  }
  // upodated getuserposts,delete post
  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const userId = (req.user as Userr)?.id;

      // Delete the post
      const deletedPost = await this._postService.deletePost(postId, userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Post deleted successfully",
        post: deletedPost,
      });
    } catch (err) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (err as Error).message });
    }
  }

  async getUsersPosts(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as Userr)?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const posts = await this._postService.getUsersPosts(userId, page, limit);

      res.status(HTTP_STATUS_CODES.OK).json(posts);
    } catch (error) {
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: (error as Error).message });
    }
  }
}
