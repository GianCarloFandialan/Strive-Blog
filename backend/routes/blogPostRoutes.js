import express from "express";
import BlogPost from "../models/BlogPost.js";
// import controlloMail from "../middlewares/controlloMail.js";
// import upload from '../middleware/upload.js';
import cloudinaryUploader from '../config/claudinaryConfig.js';
import { sendEmail } from "../services/emailService.js";
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.use(controlloMail);

router.use(authMiddleware);

// GET DI TUTTI I POST NEL DATABASE
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const sort = req.query.sort || "title";
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const blogPosts = await BlogPost.find({title: {$regex : `${req.query.title ? req.query.title : ""}`, '$options' : 'i'}})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments();

    res.json({
      blogPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch(err) {
    res.status(500).json({message: err.message})
  }
});

// GET PER UN SINGOLO POST
router.get("/:id", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// 
// router.post("/", async (req, res) => {
//   const blogPost = new BlogPost(req.body);
//   try {
//     const newBlogPost = await blogPost.save();
//     res.status(201).json(newBlogPost)
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// })

// // POST /blogPosts: crea un nuovo blog post (AGGIORNATA AD UPLOAD!)
// router.post("/", upload.single("cover"), async (req, res) => {
//   try {
//     const postData = req.body;
//     if (req.file) {
//       // Ovviamente, attenzione alla porta che avete scelto (nel mio caso è la 5001)!!!
//       postData.cover = `http://localhost:5001/uploads/${req.file.filename}`;
//     }
//     const newPost = new BlogPost(postData);
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: error.message });
//   }
// });

//POST CHE CREA UN NUOVO SINGOLO POST
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const postData = req.body;
    if (req.file) {
      postData.cover = req.file.path; // CLOUDINARY RESTITUISCE L'URL DIRETTAMENTE
    }
    const newPost = new BlogPost(postData);
    await newPost.save();

    // const htmlContent = `
    //   <h1>Il tuo post è stato pubblicato!</h1>
    //   <p>Ciao ${newPost.author},</p>
    //   <p>Il tuo post "${newPost.title}" è stato pubblicato con successo!</p>
    //   <p>Categoria: ${newPost.category}</p>
    //   <p>Grazie per il tuo contributo al blog!</p>
    // `;

    // await sendEmail(
    //   newPost.author, // Ovviamente assumendo che newPost.author sia l'email dell'autore
    //   "Il tuo post è stato correttamente pubblicato",
    //   htmlContent
    // );

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// PATCH PER AGGIORANRE UN POST
router.patch("/:id", async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH PER AGGIORNARE LA COVER DI UN POST
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Ops, nessun file caricato" });
    }

    const blogPost = await BlogPost.findById(req.params.blogPostId);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }

    blogPost.cover = req.file.path;

    await blogPost.save();

    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della copertina:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// PUT PER AGGIORNARE UN POST
router.put("/:id", async (req, res) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedBlogPost)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE PER CANCELLARE UN POST
router.delete("/:id", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }

    // ESTRAI L'PUBLIC_ID DA CLOUDINARY DALL'URL DELLA COVER
    const publicId = `blog_covers/${blogPost.cover.split('/').pop().split('.')[0]}`;

    // ELIMINA L'IMMAGINE DA CLOUDINARY
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary deletion result:", result);
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog post e immagine di copertina eliminati" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET CHE RITORNA TUTTI I COMMENTI DI UNO SPECIFICO POST
router.get("/:id/comments", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id)

    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    res.json(blogPost.comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET CHE  RITORNA UN COMMENTO SPECIFICO DI UN POST SPECIFICO
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const blogComment = blogPost.comments.id(req.params.commentId);
    if (!blogComment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    res.json(blogComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST CHE AGGIUNGE UN NUOVO COMMENTO AD UN POST SPECIFICO
router.post("/:id/comments", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content
    };
    blogPost.comments.push(newComment);
    await blogPost.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//PUT CHE CAMBIA UN COMMENTO DI UN POST SPECIFICO
router.put("/:id/comments/:commentId", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const blogComment = blogPost.comments.id(req.params.commentId);
    if (!blogComment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    blogComment.content = req.body.content;
    await blogPost.save();
    res.json(blogComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//DELETE CHE ELIMINA UN COMMENTO SPECIFICO DA UN POST SPECIFICO
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const blogComment = blogPost.comments.id(req.params.commentId);
    if (!blogComment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    blogComment.deleteOne();
    await blogPost.save();
    res.json({ message: "Commento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;