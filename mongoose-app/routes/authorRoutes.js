import express from "express";
import Author from "../models/Author.js";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/claudinaryConfig.js";

const router = express.Router();

// Rotta per ottenere la lista di tutti gli utenti nel DB
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find({});
    res.json(authors)
  } catch(err) {
    res.status(500).json({message: err.message})
  }
});

// Rotta per un singolo autore
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Rotta per tutti i post di un singolo autore
router.get("/:id/blogPosts", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    const email = author.email;
    if (!email) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const sort = req.query.sort || "title";
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    const blogPosts = await BlogPost.find( {author : `${email}`})      
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.find( {author : `${email}`}).countDocuments();

    res.json({
      blogPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Rotta per creare un autore
router.post("/", cloudinaryUploader.single("avatar"), async (req, res) => {
  
  try {

    const postData = req.body;

    if (req.file) {
      postData.avatar = req.file.path; // CLOUDINARY RESTITUISCE L'URL DIRETTAMENTE
    }

    const author = new Author(postData)

    const newAuthor = await author.save();

    const authorResponse = newAuthor.toObject();
    delete authorResponse.password;

    res.status(201).json(newAuthor)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

// Rotta per aggioranre un autore
router.patch("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per aggioranre l'avatar di un autore
router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }

    const author = await Author.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }

    author.avatar = req.file.path;

    await author.save();

    res.json(author);
  } catch (error) {
    console.error("Errore durante l'aggiornamento dell'avatar:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// Rotta per aggiornare un autore
router.put("/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(updatedAuthor)
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per cancellare un autore
router.delete("/:id", async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(400).json({message: "Autore non trovato"})
    } else {
      res.json({message: 'Autore cancellato'})
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;