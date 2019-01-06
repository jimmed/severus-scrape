import {
  urlFactory,
  urlFactoryFromString,
  urlFactoryFromObject,
  urlFactoryFromFunction
} from "../url";

const mockUrl = () =>
  Object.freeze({ protocol: "https", hostname: "test", pathname: "path" });
const testUrl = "https://test/path";

describe("urlFactoryFromString", () => {
  it("should be a function", () => {
    expect(urlFactoryFromString).toBeInstanceOf(Function);
  });

  describe("when called with a string", () => {
    let fn;
    beforeEach(() => {
      fn = urlFactoryFromString(testUrl);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });
});

describe("urlFactoryFromObject", () => {
  it("should be a function", () => {
    expect(urlFactoryFromObject).toBeInstanceOf(Function);
  });

  describe("when called with a URL object", () => {
    let object, fn;
    beforeEach(() => {
      object = mockUrl();
      fn = urlFactoryFromObject(object);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });
});

describe("urlFactoryFromFunction", () => {
  it("should be a function", () => {
    expect(urlFactoryFromFunction).toBeInstanceOf(Function);
  });

  describe("when called with a function that returns a string", () => {
    let gen, fn;
    beforeEach(() => {
      gen = () => testUrl;
      fn = urlFactoryFromFunction(gen);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });

  describe("when called with a function that returns a URL object", () => {
    let fn, mockUrlObject;
    beforeEach(() => {
      mockUrlObject = jest.fn(mockUrl);
      fn = urlFactoryFromFunction(mockUrlObject);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should call the URL factory function", () => {
        const arg = Symbol("TEST");
        fn(arg);
        expect(mockUrlObject).toHaveBeenCalledWith(arg);
      });

      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });
});

describe("urlFactory", () => {
  it("should be a function", () => {
    expect(urlFactory).toBeInstanceOf(Function);
  });

  describe("when called with a string", () => {
    let fn;
    beforeEach(() => {
      fn = urlFactory(testUrl);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });

  describe("when called with a URL object", () => {
    let object, fn;
    beforeEach(() => {
      object = mockUrl();
      fn = urlFactory(object);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });

  describe("when called with a function that returns a string", () => {
    let gen, fn;
    beforeEach(() => {
      gen = () => testUrl;
      fn = urlFactory(gen);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });

  describe("when called with a function that returns a URL object", () => {
    let fn, mockUrlObject;
    beforeEach(() => {
      mockUrlObject = jest.fn(mockUrl);
      fn = urlFactory(mockUrlObject);
    });

    it("should return a function", () => {
      expect(fn).toBeInstanceOf(Function);
    });

    describe("which when called", () => {
      it("should call the URL factory function", () => {
        const arg = Symbol("TEST");
        fn(arg);
        expect(mockUrlObject).toHaveBeenCalledWith(arg);
      });

      it("should return a string of that URL", () => {
        expect(fn()).toBe(testUrl);
      });
    });
  });
});
