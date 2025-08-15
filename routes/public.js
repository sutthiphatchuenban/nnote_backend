import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get public notes
router.get('/notes', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await req.prisma.note.findMany({
      where: { isPublic: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      }
    });

    const total = await req.prisma.note.count({
      where: { isPublic: true }
    });

    // Hide author info for anonymous notes
    const processedNotes = notes.map(note => ({
      ...note,
      author: note.isAnonymous ? null : note.author
    }));

    res.json({
      notes: processedNotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get public notes error:', error);
    res.status(500).json({ error: 'Failed to fetch public notes' });
  }
});

// Get public note by slug
router.get('/notes/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const note = await req.prisma.note.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatar: true }
        }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (!note.isPublic) {
      return res.status(403).json({ error: 'This note is private' });
    }

    // Hide author info for anonymous notes
    const processedNote = {
      ...note,
      author: note.isAnonymous ? null : note.author
    };

    res.json({ note: processedNote });
  } catch (error) {
    console.error('Get public note error:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

export default router;