import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";



const createComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.params;
    const { content } = req.body;

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!content?.trim()) throw new apiError(400, "Comment can't be empty");
    if (!videoId) throw new apiError(400, "Video ID missing");

    const comment = await Comment.create({
        content,
        video: new mongoose.Types.ObjectId(videoId),
        createdBy: userId
    });

    if (!comment) throw new apiError(500, "Error while creating a comment");

    return res
        .status(201)
        .json(new apiResponse(201, { comment }, "Comment successfully created"));
})

const updateComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { commentId } = req.params;
    const { content } = req.body
    console.log(content)

    if (!userId) throw new apiError(401, "Unauthorized request")
    if (!commentId) throw new apiError(404, "Comment id is missing")
    if (!content?.trim()) throw new apiError(404, "Field connot be empty")

    const commentMongooseId = new mongoose.Types.ObjectId(commentId)
    const updateComment = await Comment.findByIdAndUpdate(
        commentMongooseId,
        { $set: { content: content } },
        { new: true }
    )
    console.log(updateComment)
    if (!updateComment) throw new apiError(500, "Error while updating comment")
    return res.status(200).json(new apiResponse(200, { updateComment }, "Comment is successfully updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { commentId } = req.params;

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!commentId) throw new apiError(404, "Comment id is missing")

    const commentMongooseId = new mongoose.Types.ObjectId(commentId)
    const existingComment = await Comment.findById(commentMongooseId)

    if (!existingComment) throw new apiError(404, "Comment not found")

    const deleteComment = await Comment.findByIdAndUpdate(
        commentMongooseId,
        { $set: { isDelete: !existingComment?.isDelete } },
        { new: true }
    )

    if (!deleteComment) throw new apiError(500, "Error while deleting comment")

    return res.status(200).json(new apiResponse(200, { deleteComment }, "Comment is successfully deleted"))

});

const getVideoComments = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.params;
    const { page = 1, limit = 5 } = req.query

    if (!userId) throw new apiError(401, "Unauthorized request");
    if (!videoId) throw new apiError(404, "video id is missing");

    const videoMongooseId = new mongoose.Types.ObjectId(videoId)
    const CommentAggregate = [
        { $match: { video: videoMongooseId, isDelete: false } },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "createdBy",
                as: "Commenter",
                pipeline: [{ $project: { avatar: 1, username: 1 } }]
            }
        },

    ];

    // Counting Comments
    // const commentCount = await Comment.countDocuments({ video: videoMongooseId, isDelete: false })

    const options = { page: parseInt(page), limit: parseInt(limit) }

    // Docs are already counted in paginate
    // IMP: we have to use directyly aggregate in aggregate paginate
    const paginate = await Comment.aggregatePaginate(CommentAggregate, options)
    console.log(paginate)

    if (!paginate.docs.length) throw new apiError(404, "Error while retrieving video commentss")

    return res.status(200).json(new apiResponse(200, { videoComments: paginate, }, "Video comments retrieved successfully"));
})

export {
    createComment,
    updateComment,
    deleteComment,
    getVideoComments
}