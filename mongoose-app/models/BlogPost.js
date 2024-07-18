import mongoose from "mongoose"
import { Schema, model } from "mongoose";

// SCHEMA PER I COMMENTI!
const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: true 
  },
);

const blogPostSchema = new mongoose.Schema(
  {
    // Campo 'category' di tipo String obbligatorio (required)
    category: {
      type: String,
      required: true,
    },
    // Campo 'title' di tipo String obbligatorio (required)
    title: {
      type: String,
      required: true,
    },
    // Campo 'cover' di tipo String obbligatorio e unico (unique)
    cover: {
      type: String,
      required: true,
    },
    // Campo 'readTime' di tipo String obbligatorio
    readTime: {
      value: {
        type: Number,
        min: 0,
        required: true,
      },
      unit: {
        type: String,
        default: "minute",
        required: true,
      },
    },
    // Campo 'author' di tipo String obbligatorio e unico (unique)
    author: {
      type: String,
      required: true,
    },
    // Campo 'avatar' di tipo String obbligatorio
    content: {
      type: String,
      required: true,
    },
    comments: [commentSchema]
  },
  {
    timestamps: true,
    collection: "blogPost",
  }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema)
export default BlogPost;
