import axios from "axios";
import { getRateFromFixer, refreshCache } from "../../src/dao/fixer";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("getRateFromFixer", () => {
  describe("when API call is successful", () => {
    it("should return rate for symbol", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          success: true,
          rates: {
            "SGD": 1.5
          }
        }
      });
      const res = await getRateFromFixer("USD", "SGD");
      expect(res).toEqual("1.5");
    });
  });

  describe("when base currency is invalid", () => {
    it("should return error response", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          error: {
            "code": 201,
            "type": "invalid_base_currency"
          }
        }
      });
      const res = await getRateFromFixer("AAA", "SGD");
      expect(res).toEqual(
        {
          "code": 201,
          "type": "invalid_base_currency"
        }
      );
    });
  });

  describe("when conversion currency is invalid", () => {
    it("should return error response", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          error: {
            "code": 202,
            "type": "invalid_currency_codes",
            "info": "You have provided one or more invalid Currency Codes. [Required format: currencies=EUR,USD,GBP,...]"
          }
        }
      });
      const res = await getRateFromFixer("AAA", "SGD");
      expect(res).toEqual(
        {
          "code": 202,
          "type": "invalid_currency_codes",
          "info": "You have provided one or more invalid Currency Codes. [Required format: currencies=EUR,USD,GBP,...]"
        }
      );
    });
  });
});
