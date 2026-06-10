/**
 * Admin Products API - Cloudflare Pages Function
 * GET /api/admin/products - List all products
 * POST /api/admin/products - Create product
 * PUT /api/admin/products - Update product
 * DELETE /api/admin/products?id=xxx - Delete product
 */
import { getProducts, saveProducts, jsonResponse } from '../_kv.js';

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const products = await getProducts(env.HONGTE_KV);
    return jsonResponse(products);
  } catch (error) {
    console.error('Get products error:', error);
    return jsonResponse({ error: 'Failed to fetch products' }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const products = await getProducts(env.HONGTE_KV);

    const newProduct = {
      ...body,
      id: Date.now().toString(),
      images: body.images || [],
      specs: body.specs || [],
      featured: body.featured || false,
    };

    products.push(newProduct);
    await saveProducts(env.HONGTE_KV, products);

    return jsonResponse(newProduct, 201);
  } catch (error) {
    console.error('Create product error:', error);
    return jsonResponse({ error: 'Failed to create product' }, 500);
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { id, ...updates } = body;
    const products = await getProducts(env.HONGTE_KV);

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return jsonResponse({ error: 'Product not found' }, 404);
    }

    products[index] = { ...products[index], ...updates };
    await saveProducts(env.HONGTE_KV, products);

    return jsonResponse(products[index]);
  } catch (error) {
    console.error('Update product error:', error);
    return jsonResponse({ error: 'Failed to update product' }, 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Product ID required' }, 400);
    }

    const products = await getProducts(env.HONGTE_KV);
    const filtered = products.filter(p => p.id !== id);
    await saveProducts(env.HONGTE_KV, filtered);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return jsonResponse({ error: 'Failed to delete product' }, 500);
  }
}
