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
import { handleControllerError } from "../../utils/errorHandler";
import { CreatePostInputSchema } from "../../core/dtos/user/post/post";
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
      const input = CreatePostInputSchema.parse(req.body);
      const files = req.files as Express.Multer.File[];
      const creatorId = (req.user as { id: string }).id;

      const post = await this._postService.createPost(creatorId, input, files);

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (err) {
      handleControllerError(err, res, "Failed to create post");
    }
  }

  async getPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const post = await this._postService.getPost(postId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Post fetched successfully",
        data: post,
      });
    } catch (err) {
      handleControllerError(err, res, "Failed to get post");
    }
  }

  async getAllPost(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const posts = await this._postService.getAllPost(page, limit);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Posts fetched successfully",
        data: posts,
      });
    } catch (err) {
      handleControllerError(err, res, "Failed to get posts");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      await this._postService.deletePost(postId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Post deleted successfully",
        data: true,
      });
    } catch (err) {
      handleControllerError(err, res, "Failed to delete post");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const parsed = CreatePostInputSchema.parse(req.body);
      const updated = await this._postService.editPost(
        postId,
        parsed.description
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Post updated successfully",
        data: updated,
      });
    } catch (err) {
      handleControllerError(err, res, "Failed to update post");
    }
  }
  async likeOrUnlikePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = (req.user as Userr)?.id;

      const result = await this._likeService.likeOrUnlikePost(postId, userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: `${result.liked}? "post liked":"post unliked`,
      });
    } catch (error) {
      handleControllerError(error, res, "failed to like or unlike post");
    }
  }

  async getLikesForPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const likes = await this._likeService.getLikesForPost(postId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "successfuly fetched post likes",
        data: likes,
      });
    } catch (error) {
      handleControllerError(error, res, "failed to get post likes");
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
