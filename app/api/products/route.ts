import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('searchQuery') || '';
    const gender = searchParams.get('gender') || '';
    const brand = searchParams.get('brand') || '';
    const collectionType = searchParams.get('collectionType') || '';
    const priceRange = searchParams.get('priceRange') || '';
    const sortBy = searchParams.get('sortBy') || 'popularity';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 0;

    await connectDB();

    const query: mongoose.FilterQuery<unknown> = {};

    // Search Query (supporting text searches and price matching)
    if (searchQuery) {
      const isNumeric = /^\d+$/.test(searchQuery);
      if (isNumeric) {
        const priceVal = parseInt(searchQuery, 10);
        query.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { brand: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { discountedPrice: priceVal },
          { realPrice: priceVal }
        ];
      } else {
        query.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { brand: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ];
      }
    }

    // Gender filter (multi-select, comma separated)
    if (gender) {
      const genders = gender.split(',');
      query.gender = { $in: genders.map(g => new RegExp(`^${g}$`, 'i')) };
    }

    // Brand filter (multi-select, comma separated)
    if (brand) {
      const brands = brand.split(',');
      query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // Collection Type filter (multi-select, comma separated)
    if (collectionType) {
      const types = collectionType.split(',');
      query.collectionType = { $in: types.map(t => new RegExp(`^${t}$`, 'i')) };
    }

    // Price Range filter (e.g. "1000-3000")
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        query.discountedPrice = { $gte: min, $lte: max };
      }
    }

    // Sorting
    let sortObj: Record<string, 1 | -1> = {};
    if (sortBy === 'price-asc') {
      sortObj = { discountedPrice: 1 };
    } else if (sortBy === 'price-desc') {
      sortObj = { discountedPrice: -1 };
    } else if (sortBy === 'newest') {
      sortObj = { arrivalDate: -1 };
    } else if (sortBy === 'rating') {
      sortObj = { rating: -1 };
    } else {
      // Default: popularity
      sortObj = { popularityRank: 1 };
    }

    let queryBuilder = Product.find(query).sort(sortObj);
    if (limit > 0) {
      queryBuilder = queryBuilder.limit(limit);
    }

    const dbProducts = await queryBuilder.lean();

    return NextResponse.json(dbProducts);
  } catch (error) {
    console.error("API error fetching products:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
