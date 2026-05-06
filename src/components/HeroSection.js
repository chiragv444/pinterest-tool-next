/* eslint-disable tailwindcss/no-conflicting-classname */
import { useState } from 'react';

export default function HeroSection({ hero, form }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [securityData, setSecurityData] = useState(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      setError('Unable to access clipboard. Please paste the URL manually.');
    }
  };

  const handleClear = () => {
    setUrl('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a Pinterest URL.');
      return;
    }

    setIsLoading(true);
    setResultVisible(true);

    try {
      const tokenResponse = await fetch('/api/pinterest/security/pinterest-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || tokenData.success !== true) {
        throw new Error(tokenData.error || 'Unable to generate token');
      }

      setSecurityData({
        pinterestUrl: trimmedUrl,
        token: tokenData.token,
        timestamp: tokenData.timestamp,
        secretToken: tokenData.secretToken,
      });

      const downloadResponse = await fetch('/api/pinterest/download/pinterest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: trimmedUrl,
          token: tokenData.token,
          timestamp: tokenData.timestamp,
          secretToken: tokenData.secretToken,
        }),
      });

      const downloadData = await downloadResponse.json();
      if (!downloadResponse.ok || downloadData.success !== true) {
        throw new Error(downloadData.error || 'Unable to retrieve download data');
      }

      setResult(downloadData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const performDownload = async (resourceUrl, extension, title, type) => {
    try {
      setDownloadInProgress(true);
      
      // Sanitize title for filename
      const sanitizeFilename = (str) => {
        return str
          .replace(/[^a-zA-Z0-9\s\-_]/g, '') // Remove special characters except spaces, hyphens, underscores
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .substring(0, 50) // Limit length
          .trim();
      };
      
      // Generate filename
      const baseTitle = title && title !== 'Pinterest Content' ? sanitizeFilename(title) : 'pinterest_content';
      const finalExtension = type === 'video' ? 'mp4' : (extension || 'jpg');
      const filename = `${baseTitle}.${finalExtension}`;
      
      if (
        securityData?.pinterestUrl &&
        securityData?.token &&
        securityData?.timestamp &&
        securityData?.secretToken
      ) {
        const response = await fetch('/api/pinterest/proxy/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: resourceUrl,
            pinterestUrl: securityData.pinterestUrl,
            token: securityData.token,
            timestamp: securityData.timestamp,
            secretToken: securityData.secretToken,
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
          return;
        }
      }

      const anchor = document.createElement('a');
      anchor.href = resourceUrl;
      anchor.download = filename;
      anchor.target = '_blank';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (err) {
      alert('Download failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDownloadInProgress(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="bg-[#cb2444] text-white">
        <div className="container px-5 py-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-[24px] lg:text-5xl font-extrabold tracking-tight">
              {hero?.title}
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/90 max-w-3xl mx-auto">
              {hero?.subtitle}
            </p>
          </div>

          <div className="mt-8">
            <form
              className="flex flex-col md:flex-row items-center gap-3 max-w-[750px] mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="flex-1 relative w-full">
                <div className="search-wrapper bg-[#fde8ea] relative rounded-lg overflow-hidden">
                  <span className="search-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.75 3.75L12.75 1.75C13.75 0.75 15.75 0.75 16.75 1.75L17.75 2.75C18.75 3.75 18.75 5.75 17.75 6.75L12.75 11.75C11.75 12.75 9.75 12.75 8.75 11.75M8.75 15.75L6.75 17.75C5.75 18.75 3.75 18.75 2.75 17.75L1.75 16.75C0.75 15.75 0.75 13.75 1.75 12.75L6.75 7.75C7.75 6.75 9.75 6.75 10.75 7.75"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={form?.placeholder}
                    autoComplete="off"
                    autoCapitalize="none"
                    className="w-full pl-12 pr-28 py-4 text-gray-800 bg-transparent placeholder:text-gray-500 border-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={url.trim() ? handleClear : handlePaste}
                    className="paste-btn py-1.5 px-4 absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white rounded cursor-pointer text-sm font-medium transition"
                  >
                    <span>{url.trim() ? 'Clear' : 'Paste'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-6 py-4 bg-white text-[#cb2444] font-semibold rounded-lg shadow hover:shadow-lg hover:opacity-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? 'Processing...' : form?.download_btn || 'Download'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 max-w-[750px] mx-auto rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search Result Section */}
      {resultVisible && (
        <div className="bg-white shadow-sm border-t border-gray-100">
          <div className="container px-5 py-8">
            {isLoading ? (
              // Loading State
              <div className="w-full bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-center py-16 px-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="modern-loader">
                    <div className="loader-spinner"></div>
                  </div>
                  <p className="text-sm text-gray-600">Fetching Pinterest content...</p>
                </div>
              </div>
            ) : error && !result ? (
              // Error State
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="mx-auto sm:mx-0">
                  <div className="min-h-[220px] min-w-[200px] border border-dashed border-red-200 bg-red-50 text-red-700 rounded-lg flex flex-col items-center justify-center text-center px-4 py-6">
                    <p className="font-semibold mb-2">Failed to load content</p>
                    <p className="text-sm mb-4">{error}</p>
                    <button
                      onClick={() => {
                        setError('');
                        setResult(null);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded hover:bg-red-100 text-sm font-medium transition"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : result ? (
              // Result Content - Two Column Layout
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Thumbnail */}
                {/* <div className="mx-auto lg:mx-0 max-w-[200px]">
                  {result.thumbnail && (
                    <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                      <img
                        src={result.thumbnail}
                        alt="Pinterest thumbnail"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div> */}

                {/* Right Column - Preview & Download */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {result.type === 'video' ? 'Pinterest Video' : 'Pinterest Image'}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{result.title}</p>
                    </div>
                    <button
                      onClick={() => {
                        setResult(null);
                        setResultVisible(false);
                      }}
                      className="text-gray-400 hover:text-gray-700 text-2xl leading-none cursor-pointer transition"
                    >
                      ×
                    </button>
                  </div>

                  {/* Preview Container */}
                  <div
                    className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
                    style={{ minHeight: '400px', maxHeight: '500px', padding: '10px' }}
                  >
                    {result.type === 'video' && result.resources?.[0]?.url ? (
                      <video
                        src={result.resources[0].url}
                        controls
                        playsInline
                        className="rounded-lg max-w-full max-h-full object-contain"
                        style={{ maxHeight: '480px' }}
                      />
                    ) : result.type === 'image' && result.resources?.[0]?.url ? (
                      <img
                        src={result.resources[0].url}
                        alt="Pinterest preview"
                        className="rounded-lg max-w-full max-h-full object-contain"
                        style={{ maxHeight: '480px' }}
                      />
                    ) : null}
                  </div>

                  {/* Download Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                    {result.resources && result.resources.length > 0 ? (
                      result.resources.map((item, index) => (
                        <button
                          key={`${item.url}-${index}`}
                          onClick={() => performDownload(item.url, item.extension || 'jpg', result.title, result.type)}
                          disabled={downloadInProgress}
                          className="w-full sm:w-auto px-6 py-3 bg-[#cb2444] text-white font-semibold rounded-lg hover:bg-[#a51d39] disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition flex items-center justify-center gap-2 min-w-[140px] relative"
                        >
                          <span>
                            {downloadInProgress ? 'Downloading...' : 'Download'}{' '}
                            {item.quality && `(${item.quality})`}
                          </span>
                        </button>
                      ))
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        .modern-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .loader-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #cb2444;
          border-right: 4px solid #cb2444;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          position: relative;
        }

        .loader-spinner::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          border: 4px solid transparent;
          border-top: 4px solid rgba(203, 36, 68, 0.3);
          border-right: 4px solid rgba(203, 36, 68, 0.3);
          border-radius: 50%;
          animation: spin 1.2s linear infinite reverse;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .search-wrapper.error {
          border: 1px solid #fca5a5;
          background-color: #fef2f2 !important;
        }

        .search-wrapper.error input {
          color: #dc2626;
        }
      `}</style>
    </>
  );
}

