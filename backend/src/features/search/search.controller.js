import SearchService from './search.service.js';
import { success } from '../../core/utils/response.js';

class SearchController {
  async search(req, res, next) {
    try {
      const { q: query, limit = 10 } = req.query;
      const userId = req.user ? req.user.id : null;

      if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Query parameter is required' });
      }

      const results = await SearchService.generalSearch(query.trim(), userId, parseInt(limit));

      success(res, 'Search results retrieved successfully', results);
    } catch (error) {
      next(error);
    }
  }
}

export default new SearchController();