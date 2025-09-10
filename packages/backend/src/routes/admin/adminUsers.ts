import express, { Request, Response, Router } from 'express';
import * as adminUsersService from '../../services/adminUsersServices';
const router:Router = express.Router();

const now = new Date().toISOString();

router.get('/users', async (req: Request, res: Response) => {
  console.log('Request received at /some-endpoint:', req.query);

  try {
    const {
      searchTerm,
      roles,
      permissionsInclude,
      lastLoginAfter,
      lastLoginBefore,
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      lastActivityAfter,
      lastActivityBefore,
      activeLastNDays,
      limit,
      offset,
    } = req.query;

    const filters: any = {};

    if (searchTerm && typeof searchTerm === 'string') {
      filters.searchTerm = searchTerm;
    }
    if (roles) {
      if (Array.isArray(roles)) {
        filters.roles = roles;
      } else if (typeof roles === 'string') {
        filters.roles = roles.split(',').map(r => r.trim());
      }
    }

    if (permissionsInclude) {
      if (Array.isArray(permissionsInclude)) {
        filters.permissionsInclude = permissionsInclude;
      } else if (typeof permissionsInclude === 'string') {
        filters.permissionsInclude = permissionsInclude.split(',').map(p => p.trim());
      }
    }

    const parseAndValidateDate = (dateStr: any, paramName: string): Date => {
      if (typeof dateStr !== 'string') {
        throw new Error(`${paramName} must be a string in ISO date format`);
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error(`${paramName} is not a valid ISO date`);
      }
      return date;
    };

    if (lastLoginAfter) {
      filters.lastLoginAfter = parseAndValidateDate(lastLoginAfter, 'lastLoginAfter');
    }

    if (lastLoginBefore) {
      filters.lastLoginBefore = parseAndValidateDate(lastLoginBefore, 'lastLoginBefore');
    }

    if (createdAfter) {
      filters.createdAfter = parseAndValidateDate(createdAfter, 'createdAfter');
    }
    if (createdBefore) {
      filters.createdBefore = parseAndValidateDate(createdBefore, 'createdBefore');
    }

    if (req.query.createdBetweenFrom || req.query.createdBetweenTo) {
      let from: Date | undefined;
      let to: Date | undefined;

      if (req.query.createdBetweenFrom) {
        from = parseAndValidateDate(req.query.createdBetweenFrom, 'createdBetweenFrom');
      }
      if (req.query.createdBetweenTo) {
        to = parseAndValidateDate(req.query.createdBetweenTo, 'createdBetweenTo');
      }

      filters.createdBetween = {};
      if (from) filters.createdBetween.from = from;
      if (to) filters.createdBetween.to = to;
    }

    if (updatedAfter) {
      filters.updatedAfter = parseAndValidateDate(updatedAfter, 'updatedAfter');
    }

    if (updatedBefore) {
      filters.updatedBefore = parseAndValidateDate(updatedBefore, 'updatedBefore');
    }

    if (lastActivityAfter) {
      filters.lastActivityAfter = parseAndValidateDate(lastActivityAfter, 'lastActivityAfter');
    }

    if (lastActivityBefore) {
      filters.lastActivityBefore = parseAndValidateDate(lastActivityBefore, 'lastActivityBefore');
    }

    if (limit) {
      const parsedLimit = parseInt(limit as string, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ success: false, error: 'limit must be a positive integer' });
      }
      filters.limit = parsedLimit;
    }

    if (offset) {
      const parsedOffset = parseInt(offset as string, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return res.status(400).json({ success: false, error: 'offset must be a non-negative integer' });
      }
      filters.offset = parsedOffset;
    }

    if (activeLastNDays) {
      const parsedDays = parseInt(activeLastNDays as string, 10);
      if (isNaN(parsedDays) || parsedDays <= 0) {
        return res.status(400).json({ success: false, error: 'activeLastNDays must be a positive integer' });
      }
      filters.activeLastNDays = parsedDays;
    }
    const users = await adminUsersService.getFilteredAdminUsers(filters);
    res.json(users);
  } catch (error: any) {
    if (error instanceof Error && (
      error.message.includes('must be') ||
      error.message.includes('not a valid') ||
      error.message.includes('already exists') ||
      error.message.includes('Missing required')
    )) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/users', async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await adminUsersService.addAdminUser(userData);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const updateData = req.body;

    await adminUsersService.updateAdminUser(id, updateData);

    // אחרי עדכון, תביא את המשתמש מחדש כולל baseUser
    const updatedUser = await adminUsersService.getAdminUserById(id);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error(error);
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;