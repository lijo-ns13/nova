import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../di/types";
import { IPostService } from "../../interfaces/services/Post/IPostService";
import { IPostController } from "../../interfaces/controllers/post/IPostController";
import { ILikeService } from "../../interfaces/services/Post/ILikeService";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { handleControllerError } from "../../utils/errorHandler";
import { CreatePostInputSchema } from "../../core/dtos/user/post/post";
import { ICommentService } from "../../interfaces/services/Post/ICommentService";
import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from "../../core/validations/user/comment.schema";
import { AuthenticatedUser } from "../../interfaces/request/authenticated.user.interface";

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
      const userId = (req.user as AuthenticatedUser)?.id;

      const result = await this._likeService.likeOrUnlikePost(postId, userId);
      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: result.liked ? "post liked" : "post unliked",
        data: result.liked,
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
        message: "Successfully fetched post likes",
        data: likes,
      });
    } catch (error) {
      handleControllerError(error, res, "Failed to get post likes");
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    console.log("chekcing creat comemnt");
    try {
      const { postId, content, parentId, authorName } =
        CreateCommentSchema.parse(req.body);

      const authorId = (req.user as AuthenticatedUser).id;

      const comment = await this._commentService.createComment({
        postId,
        content,
        authorId,
        authorName,
        parentId,
      });

      res.status(HTTP_STATUS_CODES.CREATED).json({
        success: true,
        message: "Comment created successfully.",
        data: comment,
      });
    } catch (error) {
      handleControllerError(error, res, "Failed to create comment");
    }
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = (req.user as AuthenticatedUser).id;

      const updatedComment = await this._commentService.updateComment({
        commentId,
        content,
        userId,
      });

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Comment updated successfully.",
        data: updatedComment,
      });
    } catch (error) {
      handleControllerError(error, res, "Failed to update comment");
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = (req.user as AuthenticatedUser).id;

      await this._commentService.deleteComment(commentId, userId);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Comment deleted successfully.",
      });
    } catch (error) {
      handleControllerError(error, res, "Failed to delete comment");
    }
  }

  async getPostComments(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const comments = await this._commentService.getCommentsByPostId(
        postId,
        page,
        limit
      );

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Fetched comments successfully.",
        data: comments,
      });
    } catch (error) {
      handleControllerError(error, res, "Failed to get post comments");
    }
  }

  async getUsersPosts(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      if (!userId) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: User ID missing from token",
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const posts = await this._postService.getUsersPosts(userId, page, limit);

      res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        message: "Successfully fetched user posts",
        data: posts,
      });
    } catch (error) {
      console.log("error", error);
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch user posts",
      });
    }
  }
}
