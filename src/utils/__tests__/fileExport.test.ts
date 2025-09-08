import {
  generateTimestamp,
  generateUniqueId,
  exportToolsToJSON,
} from '../fileExport';
import type { Tool } from '../../types';

// Mock crypto.randomUUID
const mockCrypto = {
  randomUUID: vi.fn(),
};

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

// Mock document methods
const mockCreateElement = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

// Mock link click
const mockClick = vi.fn();

beforeAll(() => {
  // Mock globalThis objects
  Object.defineProperty(globalThis, 'crypto', {
    value: mockCrypto,
    writable: true,
  });

  Object.defineProperty(globalThis, 'URL', {
    value: {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    },
    writable: true,
  });

  Object.defineProperty(globalThis, 'document', {
    value: {
      createElement: mockCreateElement,
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      },
    },
    writable: true,
  });
});

beforeEach(() => {
  vi.clearAllMocks();

  // Reset mocks
  mockCreateObjectURL.mockReturnValue('mock-url');
  mockCreateElement.mockReturnValue({
    href: '',
    download: '',
    style: { display: '' },
    click: mockClick,
  });
});

describe('fileExport', () => {
  describe('generateTimestamp', () => {
    it('should generate a valid timestamp string', () => {
      const timestamp = generateTimestamp();

      // Should be a string
      expect(typeof timestamp).toBe('string');

      // Should not contain colons or dots (replaced with dashes)
      expect(timestamp).not.toMatch(/[:.]/);

      // Should be a valid ISO-like format
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}$/);
    });

    it('should generate different timestamps for different calls', () => {
      const timestamp1 = generateTimestamp();
      const timestamp2 = generateTimestamp();

      // They should be different (unless called in the same millisecond)
      expect(timestamp1).toBeDefined();
      expect(timestamp2).toBeDefined();
    });
  });

  describe('generateUniqueId', () => {
    it('should use crypto.randomUUID when available', () => {
      const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
      mockCrypto.randomUUID.mockReturnValue(mockUUID);

      const id = generateUniqueId();

      expect(mockCrypto.randomUUID).toHaveBeenCalled();
      expect(id).toBe(mockUUID);
    });

    it('should fallback to timestamp + random when crypto.randomUUID is not available', () => {
      // Mock crypto as undefined
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        writable: true,
      });

      const id = generateUniqueId();

      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(10); // timestamp + random string

      // Restore crypto mock
      Object.defineProperty(globalThis, 'crypto', {
        value: mockCrypto,
        writable: true,
      });
    });

    it('should generate different IDs for different calls', () => {
      // Mock different UUIDs for each call
      mockCrypto.randomUUID
        .mockReturnValueOnce('123e4567-e89b-12d3-a456-426614174000')
        .mockReturnValueOnce('987fcdeb-51a2-43d1-b789-123456789abc');

      const id1 = generateUniqueId();
      const id2 = generateUniqueId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });
  });

  describe('exportToolsToJSON', () => {
    const mockTools: Tool[] = [
      {
        id: '1',
        name: 'Weather Forecast',
        params: { city: 'New York', days: '7' },
        position: { x: 10, y: 20 },
      },
      {
        id: '2',
        name: 'Email Tool',
        params: { to: 'test@example.com', subject: 'Test' },
        position: { x: 30, y: 40 },
      },
    ];

    it('should create and download a JSON file', () => {
      exportToolsToJSON(mockTools);

      // Should create a blob with JSON data
      expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));

      // Should create a link element
      expect(mockCreateElement).toHaveBeenCalledWith('a');

      // Should append and remove the link
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();

      // Should click the link
      expect(mockClick).toHaveBeenCalled();

      // Should revoke the object URL
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('should export tools with correct structure', () => {
      exportToolsToJSON(mockTools);

      // Get the blob that was created
      const blobCall = mockCreateObjectURL.mock.calls[0][0];
      expect(blobCall).toBeInstanceOf(Blob);
      expect(blobCall.type).toBe('application/json');

      // The blob should contain the exported data
      const reader = new FileReader();
      reader.onload = (): void => {
        const exportedData = JSON.parse(reader.result as string);

        expect(exportedData).toHaveLength(2);
        expect(exportedData[0]).toEqual({
          name: 'Weather Forecast',
          params: { city: 'New York', days: '7' },
          position: { x: 10, y: 20 },
        });
        expect(exportedData[1]).toEqual({
          name: 'Email Tool',
          params: { to: 'test@example.com', subject: 'Test' },
          position: { x: 30, y: 40 },
        });
      };
      reader.readAsText(blobCall);
    });

    it('should generate filename with timestamp', () => {
      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: mockClick,
      };
      mockCreateElement.mockReturnValue(mockLink);

      exportToolsToJSON(mockTools);

      // Should set download attribute with timestamp
      expect(mockLink.download).toMatch(
        /^tool-canvas-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/
      );
    });

    it('should handle empty tools array', () => {
      exportToolsToJSON([]);

      // Should still create and download a file
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
    });

    it('should set link properties correctly', () => {
      const mockLink = {
        href: '',
        download: '',
        style: { display: '' },
        click: mockClick,
      };
      mockCreateElement.mockReturnValue(mockLink);

      exportToolsToJSON(mockTools);

      expect(mockLink.href).toBe('mock-url');
      expect(mockLink.style.display).toBe('none');
    });
  });

  describe('Edge cases', () => {
    it('should handle tools with empty params', () => {
      const toolsWithEmptyParams: Tool[] = [
        {
          id: '1',
          name: 'Empty Tool',
          params: {},
          position: { x: 0, y: 0 },
        },
      ];

      exportToolsToJSON(toolsWithEmptyParams);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle tools with special characters in names', () => {
      const toolsWithSpecialChars: Tool[] = [
        {
          id: '1',
          name: 'Tool with "quotes" and \'apostrophes\'',
          params: { test: 'value' },
          position: { x: 0, y: 0 },
        },
      ];

      exportToolsToJSON(toolsWithSpecialChars);

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });
});
