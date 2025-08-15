import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, gif, webp) are allowed!'));
  }
});

// Upload image route
router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    const result = await req.cloudinary.uploader.upload(dataURI, {
      folder: 'nnote_images',
      resource_type: 'auto'
    });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get user's notes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notes = await req.prisma.note.findMany({
      where: { authorId: req.user.userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      }
    });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create note
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, isPublic = false, isAnonymous = false, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Generate unique slug
    const baseSlug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await req.prisma.note.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const note = await req.prisma.note.create({
      data: {
        title,
        content,
        isPublic,
        isAnonymous,
        slug,
        imageUrl,
        authorId: req.user.userId
      },
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      }
    });

    res.status(201).json({ note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isPublic, isAnonymous, imageUrl } = req.body;

    const existingNote = await req.prisma.note.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (existingNote.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this note' });
    }

    console.log('Updating note with ID:', id);
    console.log('Data received for update:', { title, content, isPublic, isAnonymous, imageUrl });

    const note = await req.prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        isPublic,
        isAnonymous,
        imageUrl
      },
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      }
    });

    console.log('Note updated successfully:', note);
    res.json({ note });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note', details: error.message });
  }
});

// Delete note
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingNote = await req.prisma.note.findUnique({
      where: { id }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (existingNote.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }

    await req.prisma.note.delete({
      where: { id }
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Get single note
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await req.prisma.note.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (note.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to view this note' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

export default router;
