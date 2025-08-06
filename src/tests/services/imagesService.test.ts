import { describe, it, expect, vi, beforeEach } from 'vitest'
import { imagesService } from '../../services/imagesService'

// Mock del servicio API
vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock de API_CONFIG
vi.mock('../../config/apiConfig', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      UPLOAD_IMAGE: '/imgs/upload',
      UPDATE_IMAGE: '/imgs/:id',
      DELETE_ADMIN_IMAGE: '/imgs/:id',
      ADMIN_IMAGE_BY_ID: '/imgs/:id',
      IMAGE_CLEANUP: '/imgs/cleanup',
      IMAGE_VALIDATE: '/imgs/validate',
      PROFILE_IMAGES: '/imgs/profile/:userId',
      POST_IMAGES: '/imgs/posts',
      EVENT_IMAGES: '/imgs/events'
    }
  }
}))

describe('ImagesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllImages', () => {
    it('should return images array when API call is successful', async () => {
      const mockImages = [
        {
          id: '1',
          fileName: 'test1.jpg',
          originalName: 'test1.jpg',
          url: 'http://example.com/test1.jpg',
          category: 'profile',
          size: 1024000,
          mimeType: 'image/jpeg',
          description: 'Test image 1',
          tags: ['test'],
          isPublic: true,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ]

      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockResolvedValueOnce({
        data: mockImages,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      })

      const result = await imagesService.getAllImages()

      expect(result).toEqual(mockImages)
      expect(api.get).toHaveBeenCalledWith('/imgs?')
    })

    it('should return empty array when API returns no data', async () => {
      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockResolvedValueOnce({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      })

      const result = await imagesService.getAllImages()

      expect(result).toEqual([])
    })

    it('should return mock images when API call fails', async () => {
      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))

      const result = await imagesService.getAllImages()

      expect(result).toHaveLength(3) // Mock images length
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('fileName')
    })
  })

  describe('getImageStats', () => {
    it('should return image stats when API call is successful', async () => {
      const mockStats = {
        totalImages: 10,
        totalSize: 10240000,
        imagesByCategory: {
          profile: 5,
          event: 3,
          post: 2
        },
        imagesByUser: {},
        publicImages: 8,
        privateImages: 2,
        activeImages: 10,
        inactiveImages: 0
      }

      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { stats: mockStats },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      })

      const result = await imagesService.getImageStats()

      expect(result).toEqual(mockStats)
      expect(api.get).toHaveBeenCalledWith('/imgs/stats')
    })

    it('should return mock stats when API call fails', async () => {
      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))

      const result = await imagesService.getImageStats()

      expect(result).toHaveProperty('totalImages')
      expect(result).toHaveProperty('totalSize')
      expect(result).toHaveProperty('imagesByCategory')
    })
  })

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockResponse = {
        image: {
          id: '1',
          fileName: 'test.jpg',
          originalName: 'test.jpg',
          url: 'http://example.com/test.jpg',
          category: 'profile',
          size: 1024,
          mimeType: 'image/jpeg',
          description: 'Test image',
          tags: ['test'],
          isPublic: true,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      }

      const { api } = await import('../../services/api')
      vi.mocked(api.post).mockResolvedValueOnce({
        data: mockResponse,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {}
      })

      const result = await imagesService.uploadImage(mockFile, 'profile', {
        description: 'Test image',
        tags: ['test'],
        isPublic: true
      })

      expect(result).toEqual(mockResponse.image)
      expect(api.post).toHaveBeenCalledWith(
        '/imgs/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      )
    })
  })

  describe('getImagePresignedUrl', () => {
    it('should return presigned URL when API call is successful', async () => {
      const mockResponse = {
        success: true,
        data: {
          presignedUrl: 'https://example.com/presigned-url',
          expiresIn: 3600
        }
      }

      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      })

      const result = await imagesService.getImagePresignedUrl('1')

      expect(result).toBe('https://example.com/presigned-url')
      expect(api.get).toHaveBeenCalledWith('/imgs/1/presigned?expiresIn=3600')
    })

    it('should return null when API call fails', async () => {
      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))

      const result = await imagesService.getImagePresignedUrl('1')

      expect(result).toBeNull()
    })

    it('should use cached URL when available', async () => {
      const mockResponse = {
        success: true,
        data: {
          presignedUrl: 'https://example.com/presigned-url',
          expiresIn: 3600
        }
      }

      const { api } = await import('../../services/api')
      vi.mocked(api.get).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      })

      // First call to populate cache
      await imagesService.getImagePresignedUrl('1')
      
      // Second call should use cache
      const result = await imagesService.getImagePresignedUrl('1')

      expect(result).toBe('https://example.com/presigned-url')
      expect(api.get).toHaveBeenCalledTimes(1) // Only called once due to cache
    })
  })

  describe('validateFile', () => {
    it('should validate file successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockResponse = {
        success: true,
        data: {
          isValid: true,
          errors: [],
          warnings: []
        }
      }

      const { api } = await import('../../services/api')
      vi.mocked(api.post).mockResolvedValueOnce({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      })

      const result = await imagesService.validateFile(mockFile)

      expect(result).toEqual(mockResponse.data)
      expect(api.post).toHaveBeenCalledWith(
        '/imgs/validate',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      )
    })

    it('should return fallback validation when API call fails', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })

      const { api } = await import('../../services/api')
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'))

      const result = await imagesService.validateFile(mockFile)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Tipo de archivo no permitido')
    })
  })
}) 