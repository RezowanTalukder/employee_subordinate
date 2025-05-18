const getSubordinateEmployees = require('../controllers/userController').getSubordinateEmployees;
const User = require('../models/userModel');
const httpMocks = require('node-mocks-http');

jest.mock('../models/userModel');


describe('getSubordinateEmployees', () => {
    it('should return subordinates with status 200', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/users/1/subordinates',
            params: { id: 1 }
        });
        const res = httpMocks.createResponse();

        const mockData = [
            { name: 'rez1', position: 2 },
            { name: 'rez2', position: 3 }
        ];
        User.find.mockResolvedValue(mockData);

        await getSubordinateEmployees(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockData);
        expect(User.find).toHaveBeenCalledWith({ position: { $gt: 1 } });
    });

    it('should return empty array if no subordinates found', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/users/10/subordinates',
            params: { id: 10 }
        });
        const res = httpMocks.createResponse();

        User.find.mockResolvedValue([]);

        await getSubordinateEmployees(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual([]);
    });

    it('should handle errors and return 500', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/users/1/subordinates',
            params: { id: 1 }
        });
        const res = httpMocks.createResponse();

        User.find.mockRejectedValue(new Error('Database error'));

        await getSubordinateEmployees(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toHaveProperty('error', 'Database error');
    });
});
