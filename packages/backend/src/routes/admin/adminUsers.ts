import express, { Request, Response } from 'express';
import * as adminUsersService from '../../services/adminUsersServices';
const router = express.Router();

const now = new Date().toISOString();

router.get('/users', async (req: Request, res: Response) => {
   try {
    const {
      lastNameStartsWith,
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
      sortBy,
      sortDirection,
      limit,
      offset,
    } = req.query;

    const filters: any = {};

    if (lastNameStartsWith && typeof lastNameStartsWith === 'string') {
      filters.lastNameStartsWith = lastNameStartsWith;
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

    const parseAndValidateDate = (dateStr: any, paramName: string) => {
      if (typeof dateStr !== 'string') {
        throw new Error(`${paramName} must be a string in ISO date format`);
      }
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error(`${paramName} is not a valid ISO date`);
      }
      return date.toISOString();
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

    if (sortBy && typeof sortBy === 'string') {
      const allowedSortBy = ['permissions', 'lastName', 'createdAt', 'lastLoginAt', 'updatedAt', 'lastActivityTimestamp'];
      if (!allowedSortBy.includes(sortBy)) {
        return res.status(400).json({ success: false, error: `sortBy must be one of ${allowedSortBy.join(', ')}` });
      }
      filters.sortBy = sortBy;
    }

    if (sortDirection && typeof sortDirection === 'string') {
      const dir = sortDirection.toLowerCase();
      if (dir !== 'asc' && dir !== 'desc') {
        return res.status(400).json({ success: false, error: 'sortDirection must be "asc" or "desc"' });
      }
      filters.sortDirection = dir;
    }

    const users = await adminUsersService.getFilteredAdminUsers(filters);

    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
router.post('/users', async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const newUser = await adminUsersService.addAdminUser(userData);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
});

router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const updateData = req.body;

    const updatedUser = await adminUsersService.updateAdminUser(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    await adminUsersService.deleteAdminUser(id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;