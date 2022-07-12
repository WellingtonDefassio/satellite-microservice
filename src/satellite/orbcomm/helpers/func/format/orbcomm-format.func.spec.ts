import * as functions from '../../index';

describe('Orbcomm-format-func', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  describe('formatParamsToGetMessages', () => {
    it('should return a correct start_utc', () => {
      const formattedParams = functions.formatParamsToGetMessages('10-10-10');

      expect(formattedParams.start_utc).toEqual('10-10-10');
    });
    it('should return a object with correct body', () => {
      const formattedParams = functions.formatParamsToGetMessages('any_data');

      expect(formattedParams).toHaveProperty('access_id');
      expect(formattedParams).toHaveProperty('password');
      expect(formattedParams).toHaveProperty('start_utc');
      expect(formattedParams).toHaveProperty('include_raw_payload');
    });
    it('should throw if not provides all params to getMessageApi', () => {
      expect(() => {
        functions.formatParamsToGetMessages('');
      }).toThrowError('Missing ParamsToGetMessages!!');
    });
  });
});
