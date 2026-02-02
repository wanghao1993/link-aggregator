import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface MetadataResponse {
  title: string;
  description?: string;
  favicon?: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkAggregator/1.0)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    const metadata: MetadataResponse = {
      url: validUrl.href,
      title: '',
      description: undefined,
      favicon: undefined,
    };

    // Title (priority: og:title > twitter:title > title tag)
    metadata.title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      validUrl.hostname;

    // Description
    metadata.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      undefined;

    // Favicon (priority: apple-touch-icon > icon > shortcut icon > /favicon.ico)
    const faviconLink =
      $('link[rel="apple-touch-icon"]').attr('href') ||
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      '/favicon.ico';

    if (faviconLink) {
      try {
        metadata.favicon = new URL(faviconLink, validUrl.origin).href;
      } catch {
        metadata.favicon = `${validUrl.origin}/favicon.ico`;
      }
    }

    // Clean up the data
    metadata.title = metadata.title.trim().substring(0, 500);
    if (metadata.description) {
      metadata.description = metadata.description.trim().substring(0, 1000);
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch metadata',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
